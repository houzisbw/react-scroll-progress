'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _propTypes = require('prop-types');

var _propTypes2 = _interopRequireDefault(_propTypes);

require('./ScrollProgressBar.css');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var ScrollProgressBar = function (_React$Component) {
	_inherits(ScrollProgressBar, _React$Component);

	function ScrollProgressBar(props) {
		_classCallCheck(this, ScrollProgressBar);

		var _this = _possibleConstructorReturn(this, (ScrollProgressBar.__proto__ || Object.getPrototypeOf(ScrollProgressBar)).call(this, props));

		_this.state = {
			percent: 0,
			timerId: null,
			isShow: false,
			bookMarkPositionObj: {},
			isRemoveButtonShow: false
		};
		return _this;
	}

	_createClass(ScrollProgressBar, [{
		key: 'componentDidMount',
		value: function componentDidMount() {
			//注意要bind才能在updateBarPercent正确获取this
			window.addEventListener('scroll', this.updateBarPercent.bind(this));
			//记录下在页面上点击元素的位置，作为书签,双击触发，与普通点击分开
			document.body.addEventListener('dblclick', this.updateBookMark.bind(this));
		}
		//更新书签

	}, {
		key: 'updateBookMark',
		value: function updateBookMark(e) {
			//兼容ie和火狐
			var evtTarget = e.target || e.srcElement;
			//获取元素到文档顶部的距离
			var offsetTop = this.getOffsetTopToDocumentTop(evtTarget);
			//计算出进度条的百分比
			//如果点击到的元素的offsetTop大于最大滚动距离，则标签添加到进度条最后面
			var maxScrollHeight = this.getMaxScrollHeightAvaliable();
			var percent = offsetTop > maxScrollHeight ? 100 : offsetTop / maxScrollHeight * 100;
			//获取点击到元素的标签和内容文字
			var tagName = evtTarget.tagName;
			var innerText = evtTarget.innerText ? evtTarget.innerText : evtTarget.textContent;
			//只截取文字前50个字符
			if (innerText) {
				innerText = innerText.length > 50 ? innerText.substring(0, 50) : innerText;
			} else {
				innerText = tagName;
			}
			//保存元素的位置以及文字
			var tempObj = this.state.bookMarkPositionObj;
			if (!tempObj.hasOwnProperty(percent)) {
				tempObj[percent] = innerText;
				this.setState({
					bookMarkPositionObj: tempObj
				});
			}
		}
		//获取元素距离文档顶部距离

	}, {
		key: 'getOffsetTopToDocumentTop',
		value: function getOffsetTopToDocumentTop(elementNode) {
			var offsetTop = 0;
			while (elementNode) {
				offsetTop += elementNode.offsetTop;
				elementNode = elementNode.offsetParent;
			}
			return offsetTop;
		}
		//获取最大滚动距离

	}, {
		key: 'getMaxScrollHeightAvaliable',
		value: function getMaxScrollHeightAvaliable() {
			//获取网页总高度
			var pageTotalHeight = document.body.scrollHeight;
			//获取窗口高度
			var windowHeight = document.documentElement.clientHeight;
			//计算出窗口可滚动的最大距离
			return pageTotalHeight > windowHeight ? pageTotalHeight - windowHeight : 0;
		}
	}, {
		key: 'updateBarPercent',
		value: function updateBarPercent(e) {
			var _this2 = this;

			//获取最大滚动距离
			var maxScrollHeight = this.getMaxScrollHeightAvaliable();
			//计算当前滚动距离的百分比
			var scrollTop = document.documentElement.scrollTop || document.body.scrollTop;
			var percent = maxScrollHeight ? scrollTop / maxScrollHeight * 100 : 0;
			//滑动完成后隐藏进度条
			clearTimeout(this.state.timerId);
			var timerId = setTimeout(function () {
				_this2.setState({
					isShow: false
				});
			}, this.props.timeAfterScrollToHide);
			//更新百分比
			this.setState({
				percent: percent,
				timerId: timerId,
				isShow: true
			});
		}
	}, {
		key: 'componentWillUnmount',
		value: function componentWillUnmount() {
			window.removeEventListener('scroll', this.updateBarPercent);
			document.body.removeEventListener('dblclick', this.updateBookMark);
		}
		//点击进度条，页面滚动到相应位置,注意react中e是合成事件，若需要获取原生底层事件，用nativeEvent属性

	}, {
		key: 'handleChangePagePosition',
		value: function handleChangePagePosition(e) {
			//兼容ie和火狐
			var evtTarget = e.target || e.srcElement;
			//鼠标点击位置距离bar左侧距离
			var offsetX = void 0;
			//火狐浏览器没有offsetX属性
			if (e.nativeEvent.offsetX) {
				offsetX = e.nativeEvent.offsetX;
			} else {
				var rectLeft = evtTarget.getBoundingClientRect().left;
				offsetX = e.nativeEvent.clientX - rectLeft;
			}
			//获取绑定事件的wrapper的宽度,这里一定是currentTarget才行
			var barTotalWidth = e.currentTarget.clientWidth;
			var targetPercent = offsetX / barTotalWidth * 100;
			//更新进度条位置
			this.setState({
				percent: targetPercent
			});
			//计算出窗口可滚动的最大距离
			var maxScrollHeight = this.getMaxScrollHeightAvaliable();
			//计算最终滚动的长度
			var yPosScrollTo = maxScrollHeight * targetPercent / 100;
			//滑动window到指定位置
			window.scrollTo(0, yPosScrollTo);
		}
		//书签被点击事件

	}, {
		key: 'handleBookMarkOnClick',
		value: function handleBookMarkOnClick(e) {
			//防止触发父元素的点击事件
			e.stopPropagation();
			//返回书签距离文档左侧的距离，这里不能写成clientX
			var offsetX = e.nativeEvent.pageX;
			//计算出百分比
			var percent = offsetX / document.documentElement.clientWidth * 100;
			//更新进度条
			this.setState({
				percent: percent
			});
			//计算出窗口可滚动的最大距离
			var maxScrollHeight = this.getMaxScrollHeightAvaliable();
			//计算最终滚动的长度
			var yPosScrollTo = maxScrollHeight * percent / 100;
			//滑动window到指定位置
			window.scrollTo(0, yPosScrollTo);
		}
		//鼠标移入wrapper触发事件

	}, {
		key: 'handleWrapperOnMouseEnterLeave',
		value: function handleWrapperOnMouseEnterLeave(e, enterOrLeave) {
			this.setState({
				isRemoveButtonShow: enterOrLeave
			});
			//如果选择了隐藏进度条，则鼠标移入时显示
			if (this.props.hideAfterScroll) {
				this.setState({
					isShow: enterOrLeave
				});
			}
		}
		//处理删除书签事件

	}, {
		key: 'handleRemoveBookmarks',
		value: function handleRemoveBookmarks(e) {
			e.stopPropagation();
			this.setState({
				bookMarkPositionObj: {}
			});
		}
	}, {
		key: 'render',
		value: function render() {
			var _this3 = this;

			//进度条位置
			var _props = this.props,
			    position = _props.position,
			    barColor = _props.barColor,
			    hideAfterScroll = _props.hideAfterScroll;

			var positionObj = {};
			position === 'top' ? positionObj = { top: 0 } : positionObj = { bottom: 0 };
			//进度条样式
			var barStyleObj = {
				width: this.state.percent + '%',
				backgroundColor: barColor
			};
			//进度条wrapper样式
			var wrapperStyleObj = {
				opacity: hideAfterScroll ? this.state.isShow ? '1' : '0' : '1'
			};
			wrapperStyleObj = Object.assign(wrapperStyleObj, positionObj);
			//书签标记
			var bookMarkList = [];
			for (var key in this.state.bookMarkPositionObj) {
				if (this.state.bookMarkPositionObj.hasOwnProperty(key)) {
					var offsetObj = {};
					if (key === '100') {
						offsetObj = { right: '0' };
					} else {
						offsetObj = { marginLeft: key + '%' };
					}
					var node = _react2.default.createElement(
						'div',
						{ className: position === 'top' ? 'react-bottom-progress-bar-bookmark-sign-top' : 'react-bottom-progress-bar-bookmark-sign-bottom',
							key: key,
							onClick: function onClick(e) {
								_this3.handleBookMarkOnClick(e);
							},
							style: offsetObj
						},
						_react2.default.createElement(
							'div',
							{ className: position === 'top' ? 'react-bottom-progress-bar-bookmark-sign-description description-top' : 'react-bottom-progress-bar-bookmark-sign-description description-bottom', onClick: function onClick(e) {
									e.stopPropagation();
								} },
							this.state.bookMarkPositionObj[key]
						)
					);
					bookMarkList.push(node);
				}
			}
			return _react2.default.createElement(
				'div',
				{ className: 'react-bottom-progress-bar-wrapper',
					style: wrapperStyleObj,
					onMouseEnter: function onMouseEnter(e) {
						_this3.handleWrapperOnMouseEnterLeave(e, true);
					},
					onMouseLeave: function onMouseLeave(e) {
						_this3.handleWrapperOnMouseEnterLeave(e, false);
					},
					onClick: function onClick(e) {
						_this3.handleChangePagePosition(e);
					}
				},
				_react2.default.createElement('div', { className: 'react-bottom-progress-bar', style: barStyleObj }),
				this.state.isRemoveButtonShow ? _react2.default.createElement('div', { className: position === 'top' ? "react-bottom-progress-bar-remove-bookmarks remove-bookmarks-top" : 'react-bottom-progress-bar-remove-bookmarks remove-bookmarks-bottom',
					onClick: function onClick(e) {
						_this3.handleRemoveBookmarks(e);
					}
				}) : null,
				bookMarkList
			);
		}
	}]);

	return ScrollProgressBar;
}(_react2.default.Component);

ScrollProgressBar.propTypes = {
	position: _propTypes2.default.oneOf(['bottom', 'top']),
	barColor: function barColor(props, propName, componentName) {
		var reg = /^#[0-9A-Fa-f]{6}$/;
		if (!reg.test(props[propName])) {
			return new Error('Invalid color ' + props[propName]);
		}
	},
	hideAfterScroll: _propTypes2.default.bool,
	timeAfterScrollToHide: _propTypes2.default.number
};
ScrollProgressBar.defaultProps = {
	position: 'top',
	barColor: '#337fff',
	hideAfterScroll: false,
	timeAfterScrollToHide: 1000
};

exports.default = ScrollProgressBar;