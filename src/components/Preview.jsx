import React from 'react'
import BarAndModules from './BarAndModules.jsx'
import { Link } from 'react-router';
import styles from './css/Prievewstyle.css';
import styles2 from './css/Prievewreset.css';
export default class Preview extends React.Component{
    constructor(props) {
        super(props);


    }
    ComponentDidMount(){
        jQuery(document).ready(function($){
            /* cache jQuery objects */
            var slideshow = $('.cd-slideshow'),
                slides = slideshow.children('li'),
                navigation = $('.cd-slideshow-nav');
            /* initialize varaibles */
            var delta = 0,
                scrollThreshold = 6,
                resizing = false,
                scrolling = false;

            /* check media query and bind corresponding events */
            var mq = windowWidth(slideshow.get(0)),
                bindToggle = false;
            bindEvents(mq, true);
            /* initilaize slidshow */
            initSlideshow(slideshow);

            /* on swipe, update visible sub-slides (if available) */
            slides.on('swipeleft', function(event){
                ( mq == 'mobile' ) && updateSubSlide($(this), 'next');
            });
            slides.on('swiperight', function(event){
                ( mq == 'mobile' ) && updateSubSlide($(this), 'prev');
            });

            /* update slideshow if user clicks on a not-visible slide (desktop version only)*/
            slides.on('click', function(event){
                var slide = $(this);
                if( mq == 'desktop' && !slide.hasClass('visible') ) {
                } else if( mq == 'desktop' && $(event.target).parents('.sub-visible').length == 0 && $(event.target).parents('.sub-slides').length > 0 ) {
                    var newSubSlide = $(event.target).parents('.cd-slider-content').parent('li'),
                        direction = ( newSubSlide.prev('.sub-visible').length > 0 ) ? 'next' : 'prev';
                    updateSubSlide(slide, direction);
                }
            });



            /* update slideshow position on resize */
            $(window).on('resize', function(){
                if( !resizing ) {
                    (!window.requestAnimationFrame) ? updateOnResize() : window.requestAnimationFrame(updateOnResize);
                    resizing = true;
                }
            });

            function updateSlideDots(listItemNav, string, newSubIndex) {
                var activeDot = listItemNav.children('.active');

                if( string == 'next' ) var newDots = activeDot.next();
                else if(  string == 'prev') var newDots = activeDot.prev();
                else var newDots = listItemNav.children('li').eq(newSubIndex);

                activeDot.removeClass('active');
                newDots.addClass('active');
            }
            var newSubSlide;
            function updateSubSlide(listItem, string, subSlide) {
                var translate = 0,
                    listItemNav = listItem.children('.slider-dots'),

                    marginSlide = Number(listItem.find('.cd-slider-content').eq(0).css('margin-right').replace('px', ''))*6,

                    windowWidth = window.innerWidth;

                windowWidth = ( mq == 'desktop' ) ? windowWidth - marginSlide : windowWidth;
                if( listItem.children('.sub-slides').length > 0 ) {
                    var subSlidesWrapper = listItem.children('.sub-slides'),
                        visibleSubSlide = subSlidesWrapper.children('.sub-visible');
                    if( visibleSubSlide.length == 0 ) visibleSubSlide = subSlidesWrapper.children('li').eq(0).addClass('sub-visible');

                    if( string == 'nav' ) {
                        /* we have choosen a new slide from the navigation */
                        newSubSlide = subSlide;
                    } else {
                        var	newSubSlide = (string == 'next') ? visibleSubSlide.next() : visibleSubSlide.prev();

                    }

                    if(newSubSlide.length > 0 ) {
                        var newSubSlidePosition = newSubSlide.index();
                        translate = parseInt(- newSubSlidePosition*windowWidth);

                        setTransformValue(subSlidesWrapper.get(0), 'translateX', translate + 'px');
                        updateSlideDots(listItemNav, string, newSubSlidePosition);
                        visibleSubSlide.removeClass('sub-visible');
                        newSubSlide.addClass('sub-visible');
                    }
                }
            }



            function updateOnResize() {
                mq = windowWidth(slideshow.get(0));
                bindEvents(mq, bindToggle);
                if( mq == 'mobile' ) {
                    bindToggle = true;
                    slideshow.attr('style', '').children('.visible').removeClass('visible');
                } else {
                    bindToggle = false;
                    if ( slides.filter('.visible').length == 0 ) slides.eq(0).addClass('visible');
                }
                initSlideshow(slideshow);
                resizing = false;
            }



            /* $( ".slider-dots>li" ).click(function() {
             var visibleSlide = slides.filter('.visible');
             updateSubSlide(visibleSlide,'next');
             }); */
            $( ".nextSlideButton1" ).click(function() {
                var visibleSlide = slides.filter('.visible');
                updateSubSlide(visibleSlide, 'next');
                var translate = 0,
                    listItemNav = visibleSlide.children('.slider-dots'),

                    marginSlide = Number(visibleSlide.find('.cd-slider-content').eq(0).css('margin-right').replace('px', ''))*6,

                    windowWidth = window.innerWidth;

                windowWidth = ( mq == 'desktop' ) ? windowWidth - marginSlide : windowWidth;
                if( visibleSlide.children('.sub-slides').length > 0 ) {
                    var subSlidesWrapper = visibleSlide.children('.sub-slides'),
                        visibleSubSlide = subSlidesWrapper.children('.sub-visible');
                    if( visibleSubSlide.length == 0 ) visibleSubSlide = subSlidesWrapper.children('li').eq(0).addClass('sub-visible');
                    newSubSlide=visibleSubSlide.next()
                    if(newSubSlide.length > 0 ) {
                        var newSubSlidePosition = newSubSlide.index();
                        translate = parseInt(- newSubSlidePosition*windowWidth);

                        setTransformValue(subSlidesWrapper.get(0), 'translateX', translate + 'px');
                        updateSlideDots(listItemNav, "next", newSubSlidePosition);
                        visibleSubSlide.removeClass('sub-visible');
                        newSubSlide.addClass('sub-visible');
                    }
                }



            });
            function bindEvents(MQ, bool) {
                if( MQ == 'desktop' && bool) {

                    $(document).on('keydown', function(event){
                        if( event.which=='32' ) {
                            var visibleSlide = slides.filter('.visible');
                            updateSubSlide(visibleSlide, 'next');
                        }
                        else if( event.which=='39' ) {
                            var visibleSlide = slides.filter('.visible');
                            updateSubSlide(visibleSlide, 'next');
                        } else if ( event.which=='37' ) {
                            var visibleSlide = slides.filter('.visible');
                            updateSubSlide(visibleSlide, 'prev');
                        }
                    });
                } else if( MQ == 'mobile' ) {
                    $(document).off('keydown');
                }
            }


            function initSlideshow(slideshow) {
                var windowWidth = window.innerWidth;
                slideshow.children('li').each(function(){
                    var slide = $(this),
                        subSlideNumber = slide.children('.sub-slides').children('li').length,
                        slideWidth = (subSlideNumber) * windowWidth;
                    slideWidth = ( slideWidth == 0 ) ? windowWidth : slideWidth;
                    slide.css('width', slideWidth + 'px');
                    if( subSlideNumber > 0 ) {
                        var visibleSubSlide = slide.find('.sub-visible');
                        if( visibleSubSlide.length == 0 ) {
                            visibleSubSlide = slide.find('li').eq(0);
                            visibleSubSlide.addClass('sub-visible');
                        }
                        updateSubSlide(slide ,'nav', visibleSubSlide);
                        /* createSubSlideDots(slide, subSlideNumber); */
                    }
                });
            }

            function getTranslateValue(element, axis) {
                var elementStyle = window.getComputedStyle(element, null),
                    elementTranslate = elementStyle.getPropertyValue("-webkit-transform") ||
                        elementStyle.getPropertyValue("-moz-transform") ||
                        elementStyle.getPropertyValue("-ms-transform") ||
                        elementStyle.getPropertyValue("-o-transform") ||
                        elementStyle.getPropertyValue("transform");

                if( elementTranslate.indexOf('(') >=0 ) {
                    elementTranslate = elementTranslate.split('(')[1];
                    elementTranslate = elementTranslate.split(')')[0];
                    elementTranslate = elementTranslate.split(',');
                    var translateValue = ( axis == 'X') ? elementTranslate[4] : elementTranslate[5];
                } else {
                    var translateValue = 0;
                }

                return Number(translateValue);
            }

            function setTransformValue(element, property, value) {
                element.style["-webkit-transform"] = property+"("+value+")";
                element.style["-moz-transform"] = property+"("+value+")";
                element.style["-ms-transform"] = property+"("+value+")";
                element.style["-o-transform"] = property+"("+value+")";
                element.style["transform"] = property+"("+value+")";

                $(element).one('webkitTransitionEnd otransitionend oTransitionEnd msTransitionEnd transitionend', function(){
                    if( mq == 'desktop') {
                        delta = 0;
                    }
                });
            }

            function windowWidth(element) {
                var mq = window.getComputedStyle(element, '::before').getPropertyValue('content').replace(/["']/g, '');
                return mq;
            }
        });


    }

    render(){
        {

            return (
                <div className="body">
                    <div className="cd-slideshow-wrapper">

                        <ol className="cd-slideshow">
                            <li id="slide-2" className="visible">
                                <ol className="sub-slides">
                                    <li id="topslide1">

                                        <div className="cd-slider-content">
                                            <div className="content-wrapper">
                                                <div className="krug"><div className="a2ndBcgKrug"></div> <div className="stars"></div>
                                                    <div className="twinkling"></div>
                                                    <div className="logobykwi">NB</div></div>
                                                <div className="signsObsh">
                                                    <div className="leftSignsHello">
                                                        <p className="hello_eng signs_p smallbuk_int">Hello</p>
                                                        <p className="hello_chi signs_p smallbuk_int">ハロー</p>
                                                        <p className="hello_ger signs_p smallbuk_int"> Hallo</p>
                                                    </div>
                                                    <div className="privetDrug"><p className="hello_ru signs_p">Привет,друг!</p></div>
                                                    <div className="rightSignsFriend">
                                                        <p className="friend_ger signs_p smallbuk_int">friend</p>
                                                        <p className="friend_chi signs_p smallbuk_int">友達</p>
                                                        <p className="friend_eng signs_p smallbuk_int">freund</p>
                                                    </div>
                                                </div>
                                                <p className=" signs_p entroduce ">Позволь нам рассказать о себе <br/> в очень краткой форме;)</p>
                                                <div className="slideshowbuttons "><ol className="slider-dots"><li id="1Prew" className="active"></li><li id="2Prew"></li><li id="3Prew" onclick=""></li><li id="4Prew"onclick=""></li></ol></div>
                                                <div className="nextSlideButton"><button className="nextSlideButton1">Вперёд	</button></div>

                                            </div>

                                        </div>
                                    </li>

                                    <li id="topslide2">
                                        <div className="cd-slider-content">
                                            <div className="content-wrapper">
                                                <div className="krug"><div className="a2ndBcgKrug"></div> <div className="stars"></div>
                                                    <div className="twinkling"></div>
                                                    <div className="logobykwi">NB</div></div>
                                                <div className="zagolovokPresentSlide">Чем мы полезны?</div>
                                                <div className="SecondSlidePresentasionText"><i className="fa fa-bullhorn fa-3x fafixpadding" aria-hidden="true"></i><div className="SecondSlidePresentasionText1 ">Создай свой чат или событие, <br/>присоединяйся к уже заплонированным,<br/> мероприятиям и чатам.</div></div>
                                                <div className="SecondSlidePresentasionText"><i className="fa fa-comments-o fa-3x fafixpadding" aria-hidden="true"></i><div className="SecondSlidePresentasionText1 ">Пользуйся простым и быстрым чатом,<br/>узнай местоположение друзей и себя,<br/>а также погоду на сегодня!С остальным<br/> функционалом познакомишся сам:)..</div></div>
                                                <div className="slideshowbuttons"><ol className="slider-dots"><li id="1Prew" ></li><li id="2Prew" className="active"></li><li id="3Prew" onclick=""></li><li id="4Prew"onclick=""></li></ol></div>
                                                <div className="nextSlideButton"><button className="nextSlideButton1">Вперёд	</button></div>
                                            </div>
                                        </div>
                                    </li>

                                    <li id="topslide3">
                                        <div className="cd-slider-content">
                                            <div className="content-wrapper">
                                                <div className="krug"><div className="a2ndBcgKrug"></div> <div className="stars"></div>
                                                    <div className="twinkling"></div>
                                                    <div className="logobykwi">NB</div></div>
                                                <div className="zagolovokPresentSlide">Help</div>
                                                <div className="SecondSlidePresentasionText SecondSlidePresentasionText_fix"><i className="fa fa-info-circle fa-3x" aria-hidden="true"></i><div className="SecondSlidePresentasionText1 ">Маленьким разработчикам очень <br/> тяжело конкурировать с большими проектами. <br/>Если тебе что-то понравилось в ходе <br/> использования, расскажи о нас друзьям.</div></div>
                                                <div className="zagolovokPresentSlide">БОЛЬШОЕ СПАСИБО.</div>
                                                <div className="slideshowbuttons"><ol className="slider-dots"><li id="1Prew" ></li><li id="2Prew"></li><li id="3Prew" onclick="" className="active"></li><li id="4Prew"onclick=""></li></ol></div>
                                                <div className="nextSlideButton"><button className="nextSlideButton1">Вперёд	</button></div>
                                            </div>
                                        </div>
                                    </li>

                                    <li id="topslide4">
                                        <div className="cd-slider-content">
                                            <div className="content-wrapper">
                                                <div className="krug"><div className="a2ndBcgKrug"></div> <div className="stars"></div>
                                                    <div className="twinkling"></div>
                                                    <div className="logobykwi logobykwi_fix">&lt;/&gt;</div></div>
                                                <div className="zagolovokPresentSlide">...Последние</div>
                                                <div className="SecondSlidePresentasionText SecondSlidePresentasionText_fix2"><i className="fa fa-bug fa-3x" aria-hidden="true"></i><div className="SecondSlidePresentasionText1 ">Если у вас возникли какие-либо баги/ошибки  не паникуйте... Многие элементы находятся в разработке и могут отключиться.Подождите некоторое время, а потом попробуйте снова. Мы принимаем творческих личностей к себя в комманду. Подробние в разделе «Партнёрам».</div></div>

                                                <div className="slideshowbuttons"><ol className="slider-dots"><li id="1Prew" ></li><li id="2Prew"></li><li id="3Prew" onclick=""></li><li id="4Prew"onclick="" className="active" ></li></ol></div>
                                                <div className="nextSlideButton closepresentation"><button className="nextSlideButton1" onClick={this.props.StartBut} >Начать	</button></div>
                                            </div>
                                        </div>
                                    </li>
                                    <li id="topslide5">

                                    </li>
                                </ol>

                            </li>

                        </ol>
                    </div>
                </div>
            );}
    }
};