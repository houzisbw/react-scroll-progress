import React from 'react'
import PropTypes from 'prop-types'
import './ScrollProgressBar.css'
class ScrollProgressBar extends React.Component{
	constructor(props){
		super(props);
		this.state = {
			percent:0,
			timerId:null,
			isShow:false,
			bookMarkPositionObj:{},
			isRemoveButtonShow:false,
		}
	}
	componentDidMount(){
		//注意要bind才能在updateBarPercent正确获取this
		window.addEventListener('scroll',this.updateBarPercent.bind(this));
		//记录下在页面上点击元素的位置，作为书签,双击触发，与普通点击分开
		document.body.addEventListener('dblclick',this.updateBookMark.bind(this));
	}
	//更新书签
	updateBookMark(e){
		//兼容ie和火狐
		let evtTarget = e.target || e.srcElement;
		//获取元素到文档顶部的距离
		let offsetTop = this.getOffsetTopToDocumentTop(evtTarget);
		//计算出进度条的百分比
		//如果点击到的元素的offsetTop大于最大滚动距离，则标签添加到进度条最后面
		let maxScrollHeight = this.getMaxScrollHeightAvaliable();
		let percent = offsetTop > maxScrollHeight? 100: offsetTop/maxScrollHeight*100;
		//获取点击到元素的标签和内容文字
		let tagName = evtTarget.tagName;
		let innerText = evtTarget.innerText?evtTarget.innerText:evtTarget.textContent;
		//只截取文字前50个字符
		if(innerText){
			innerText = innerText.length>50?innerText.substring(0,50):innerText
		}else{
			innerText = tagName
		}
		//保存元素的位置以及文字
		let tempObj = this.state.bookMarkPositionObj;
		if(!tempObj.hasOwnProperty(percent)){
			tempObj[percent] = innerText;
			this.setState({
				bookMarkPositionObj:tempObj
			})
		}
	}
	//获取元素距离文档顶部距离
	getOffsetTopToDocumentTop(elementNode){
		let offsetTop = 0;
		while(elementNode){
			offsetTop+=elementNode.offsetTop;
			elementNode = elementNode.offsetParent;
		}
		return offsetTop;
	}
	//获取最大滚动距离
	getMaxScrollHeightAvaliable(){
		//获取网页总高度
		let pageTotalHeight = document.body.scrollHeight;
		//获取窗口高度
		let windowHeight = document.documentElement.clientHeight;
		//计算出窗口可滚动的最大距离
		return pageTotalHeight>windowHeight ? pageTotalHeight-windowHeight : 0;
	}
	updateBarPercent(e){
		//获取最大滚动距离
		let maxScrollHeight = this.getMaxScrollHeightAvaliable();
		//计算当前滚动距离的百分比
		let scrollTop = document.documentElement.scrollTop || document.body.scrollTop;
		let percent = maxScrollHeight?scrollTop / maxScrollHeight * 100:0;
		//滑动完成后隐藏进度条
		clearTimeout(this.state.timerId);
		let timerId = setTimeout(()=>{
				this.setState({
				isShow:false
			})
	},this.props.timeAfterScrollToHide);
		//更新百分比
		this.setState({
			percent:percent,
			timerId:timerId,
			isShow:true
		});
	}
	componentWillUnmount(){
		window.removeEventListener('scroll',this.updateBarPercent);
		document.body.removeEventListener('dblclick',this.updateBookMark);
	}
	//点击进度条，页面滚动到相应位置,注意react中e是合成事件，若需要获取原生底层事件，用nativeEvent属性
	handleChangePagePosition(e){
		//兼容ie和火狐
		let evtTarget = e.target || e.srcElement;
		//鼠标点击位置距离bar左侧距离
		let offsetX;
		//火狐浏览器没有offsetX属性
		if(e.nativeEvent.offsetX){
			offsetX = e.nativeEvent.offsetX;
		}else{
			let rectLeft = evtTarget.getBoundingClientRect().left;
			offsetX = e.nativeEvent.clientX - rectLeft
		}
		//获取绑定事件的wrapper的宽度,这里一定是currentTarget才行
		let barTotalWidth = e.currentTarget.clientWidth;
		let targetPercent = offsetX/barTotalWidth*100;
		//更新进度条位置
		this.setState({
			percent:targetPercent
		});
		//计算出窗口可滚动的最大距离
		let maxScrollHeight = this.getMaxScrollHeightAvaliable();
		//计算最终滚动的长度
		let yPosScrollTo = maxScrollHeight*targetPercent/100;
		//滑动window到指定位置
		window.scrollTo(0,yPosScrollTo)
	}
	//书签被点击事件
	handleBookMarkOnClick(e){
		//防止触发父元素的点击事件
		e.stopPropagation();
		//返回书签距离文档左侧的距离，这里不能写成clientX
		let offsetX = e.nativeEvent.pageX;
		//计算出百分比
		let percent = offsetX / document.documentElement.clientWidth * 100;
		//更新进度条
		this.setState({
			percent:percent
		});
		//计算出窗口可滚动的最大距离
		let maxScrollHeight = this.getMaxScrollHeightAvaliable();
		//计算最终滚动的长度
		let yPosScrollTo = maxScrollHeight*percent/100;
		//滑动window到指定位置
		window.scrollTo(0,yPosScrollTo)
	}
	//鼠标移入wrapper触发事件
	handleWrapperOnMouseEnterLeave(e,enterOrLeave){
		this.setState({
			isRemoveButtonShow:enterOrLeave
		});
		//如果选择了隐藏进度条，则鼠标移入时显示
		if(this.props.hideAfterScroll){
			this.setState({
				isShow:enterOrLeave
			})
		}
	}
	//处理删除书签事件
	handleRemoveBookmarks(e){
		e.stopPropagation();
		this.setState({
			bookMarkPositionObj:{}
		})
	}
	render(){
		//进度条位置
		const {position,barColor,hideAfterScroll} = this.props;
		let positionObj = {};
		position==='top'?positionObj = {top:0}:positionObj = {bottom:0};
		//进度条样式
		let barStyleObj = {
			width:this.state.percent+'%',
			backgroundColor:barColor,
		};
		//进度条wrapper样式
		let wrapperStyleObj = {
			opacity:hideAfterScroll?(this.state.isShow?'1':'0'):('1')
		};
		wrapperStyleObj = Object.assign(wrapperStyleObj,positionObj);
		//书签标记
		let bookMarkList = [];
		for(let key in this.state.bookMarkPositionObj){
			if(this.state.bookMarkPositionObj.hasOwnProperty(key)){
				let offsetObj = {};
				if(key==='100'){
					offsetObj = {right:'0'};
				}else{
					offsetObj = {marginLeft:key+'%'};
				}
				let node = (
					<div className={position==='top'?'react-bottom-progress-bar-bookmark-sign-top':'react-bottom-progress-bar-bookmark-sign-bottom'}
				key={key}
				onClick={(e)=>{this.handleBookMarkOnClick(e)}}
				style={offsetObj}
					>
					{/*标签说明文字*/}
					<div className={position==='top'?'react-bottom-progress-bar-bookmark-sign-description description-top':'react-bottom-progress-bar-bookmark-sign-description description-bottom'} onClick={(e)=>{e.stopPropagation()}}>
				{this.state.bookMarkPositionObj[key]}
			</div>
				</div>
			);
				bookMarkList.push(node);
			}
		}
		return (
			<div className="react-bottom-progress-bar-wrapper"
		style={wrapperStyleObj}
		onMouseEnter={(e)=>{this.handleWrapperOnMouseEnterLeave(e,true)}}
		onMouseLeave={(e)=>{this.handleWrapperOnMouseEnterLeave(e,false)}}
		onClick={(e)=>{this.handleChangePagePosition(e)}}
	>
	<div className="react-bottom-progress-bar" style={barStyleObj}>
			</div>
			{/*清除书签的按钮*/}
		{
			this.state.isRemoveButtonShow?(
				<div className={position==='top'?"react-bottom-progress-bar-remove-bookmarks remove-bookmarks-top":'react-bottom-progress-bar-remove-bookmarks remove-bookmarks-bottom'}
			onClick={(e)=>{this.handleRemoveBookmarks(e)}}
		>
		</div>
		):null
		}
		{/*书签标记*/}
		{
			bookMarkList
		}
	</div>
	)
	}
}

ScrollProgressBar.propTypes = {
	position:PropTypes.oneOf(['bottom','top']),
	barColor:function(props, propName, componentName) {
		let reg = /^#[0-9A-Fa-f]{6}$/;
		if(!reg.test(props[propName])){
			return new Error('Invalid color '+props[propName])
		}
	},
	hideAfterScroll:PropTypes.bool,
	timeAfterScrollToHide:PropTypes.number
};
ScrollProgressBar.defaultProps = {
	position:'top',
	barColor:'#337fff',
	hideAfterScroll:false,
	timeAfterScrollToHide:1000
};


export default ScrollProgressBar