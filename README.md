# React Scroll Progress Bar with bookmarks
![img](https://github.com/houzisbw/react-scroll-progress/blob/master/images/example.jpg)
A simple progress component record your scroll position, you can **click** the progress bar to reach a specific document position, addtionally,**double-click** the element on page then you got a **bookmark** hang on the progress bar.

Click the bookmark then you can reach the position of the element on page, click the 'X' button on right of scroll bar you can delete all bookmarks

The bookmark function is useful when you read a large long article, with bookmarks you can go back easily.

## Installation

##### NPM
```bash
npm install --save react-scroll-progress-with-bookmark
```
##### Yarn
```bash
yarn add react-scroll-progress-with-bookmark
```

## Usage
```js
import ProgressBar from 'react-scroll-progress-with-bookmark'
<ProgressBar position="top" barColor="#df2233"/>
```
## Props
| Name | Type | Default | Description |
|------|------|---------|-------------|
| position | string | 'top' | ProgressBar position on window('top','bottom') |
| barColor | string | '#337fff' | Progress bar color |
| hideAfterScroll | bool | false | if `true` the progress bar will hide after scroll |
| timeAfterScrollToHide | number | 1000 | Interval time(ms) for hideAfterScroll |

