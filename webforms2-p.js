/*
 *  Web Forms 2.0 Cross-browser Implementation <http://code.google.com/p/webforms2/>
 *  Version: 0.1 (2007-05)
 *  Copyright: 2007, Weston Ruter <http://weston.ruter.net/>
 *  License: http://creativecommons.org/licenses/LGPL/2.1/
 * 
 *  The comments contained in this code are largely quotations from the 
 *  WebForms 2.0 specification: <http://whatwg.org/specs/web-forms/current-work/>
 *
 *  Usage: <script type="text/javascript" src="webforms2-p.js"></script>
 */

if(!window.$wf2){
var $wf2 = {};

if(document.implementation&&document.implementation.hasFeature&&!document.implementation.hasFeature("WebForms","2.0")){var RepetitionElement={REPETITION_NONE:0,REPETITION_TEMPLATE:1,REPETITION_BLOCK:2};$wf2={version:"0.1",isInitialized:false,repetitionTemplates:[],libpath:"",init:function(){if($wf2.isInitialized)return;$wf2.isInitialized=true;$wf2.createMiscFunctions();var i;var style=document.createElement('link');style.setAttribute('type','text/css');style.setAttribute('rel','stylesheet');style.setAttribute('href',$wf2.libpath+'webforms2.css');var parent=document.getElementsByTagName('head')[0];if(!parent)parent=document.getElementsByTagName('*')[0];parent.insertBefore(style,parent.firstChild);if(window.Element&&Element.prototype){Element.prototype.REPETITION_NONE=RepetitionElement.REPETITION_NONE;Element.prototype.REPETITION_TEMPLATE=RepetitionElement.REPETITION_TEMPLATE;Element.prototype.REPETITION_BLOCK=RepetitionElement.REPETITION_BLOCK;Element.prototype.repetitionType=RepetitionElement.REPETITION_NONE;Element.prototype.repetitionIndex=0;Element.prototype.repetitionTemplate=null;Element.prototype.repetitionBlocks=null;Element.prototype.repeatStart=1;Element.prototype.repeatMin=0;Element.prototype.repeatMax=Infinity;Element.prototype.addRepetitionBlock=$wf2.addRepetitionBlock;Element.prototype.addRepetitionBlockByIndex=$wf2.addRepetitionBlockByIndex;Element.prototype.moveRepetitionBlock=$wf2.moveRepetitionBlock;Element.prototype.removeRepetitionBlock=$wf2.removeRepetitionBlock}$wf2.initRepetitionBlocks();$wf2.initRepetitionTemplates();$wf2.initRepetitionButtons('add');$wf2.initRepetitionButtons('remove');$wf2.initRepetitionButtons('move-up');$wf2.initRepetitionButtons('move-down');$wf2.updateAddButtons();$wf2.updateMoveButtons();if(document.addEventListener){document.addEventListener("mousedown",$wf2.clearInvalidIndicators,false);document.addEventListener("keydown",$wf2.clearInvalidIndicators,false)}else if(document.attachEvent){document.attachEvent("onmousedown",$wf2.clearInvalidIndicators);document.attachEvent("onkeydown",$wf2.clearInvalidIndicators)}$wf2.initWF2Functionality()},initWF2Functionality:function(parent){parent=(parent||document.documentElement);var i,j,form,forms=parent.getElementsByTagName('form');for(i=0;form=forms[i];i++){if(form.checkValidity)continue;form.checkValidity=$wf2.formCheckValidity;if(form.addEventListener)form.addEventListener('submit',$wf2.onsubmitValidityHandler,false);else form.attachEvent('onsubmit',$wf2.onsubmitValidityHandler)}var tagNames=["input","select","textarea","button","fieldset"];var controls=parent.getElementsByTagName([i]);for(i=0;i<tagNames.length;i++){controls=parent.getElementsByTagName(tagNames[i]);for(j=0;control=controls[j];j++){$wf2.applyValidityInterface(control);$wf2.updateValidityState(control);}}var els=$wf2.getElementsByTagNameAndAttribute.apply(document.documentElement,["*","autofocus"]);if(parent.getAttribute('autofocus'))els.unshift(parent);for(i=0;i<els.length;i++)$wf2.initAutofocusElement(els[i]);var ta,textareas=$wf2.getElementsByTagNameAndAttribute.apply(parent,['textarea','maxlength']);if(parent.nodeName.toLowerCase()=='textarea')textareas.unshift(parent);for(i=0;ta=textareas[i];i++)ta.maxlength=parseInt(ta.getAttribute('maxlength'));},initAutofocusElement:function(el){if(el.autofocus===false||el.autofocus===true)return;el.autofocus=true;if(el.disabled)return;var node=el;while(node&&node.nodeType==1){if($wf2.getElementStyle(node,'visibility')=='hidden'||$wf2.getElementStyle(node,'display')=='none')return;node=node.parentNode}el.focus();},repetitionTemplate_constructor:function(){if(this._initialized)return;this._initialized=true;this.style.display='none';this.repetitionType=RepetitionElement.REPETITION_TEMPLATE;this.repetitionIndex=0;this.repetitionTemplate=null;this.repetitionBlocks=[];var _attr;this.repeatStart=/^\d+$/.test(_attr=this.getAttribute('repeat-start'))?parseInt(_attr):1;this.repeatMin=/^\d+$/.test(_attr=this.getAttribute('repeat-min'))?parseInt(_attr):0;this.repeatMax=/^\d+$/.test(_attr=this.getAttribute('repeat-max'))?parseInt(_attr):Infinity;if(!this.addRepetitionBlock)this.addRepetitionBlock=function(refNode,index){return $wf2.addRepetitionBlock.apply(this,[refNode,index]);};if(!this.addRepetitionBlockByIndex)this.addRepetitionBlockByIndex=this.addRepetitionBlock;var form=this;while(form=form.parentNode){if(form.nodeName.toLowerCase()=='form')break}var _templateElements;if(form&&(_templateElements=$wf2.getElementsByTagNames.apply(this,['button','input','select','textarea','isindex'])).length){for(var el,i=0;el=_templateElements[i];i++)el.disabled=true;}var sibling=this;while(sibling=sibling.previousSibling){if(sibling.repetitionType==RepetitionElement.REPETITION_BLOCK&&!sibling.getAttribute('repeat-template')){sibling.repetitionTemplate=this;sibling.setAttribute('repeat-template',this.id);this.repetitionBlocks.unshift(sibling)}}for(var i=0;(i<this.repeatStart||this.repetitionBlocks.length<this.repeatMin);i++)this.addRepetitionBlock();$wf2.repetitionTemplates.push(this);this._initialized=true},initRepetitionTemplates:function(parentNode){var repetitionTemplates=$wf2.getElementsByTagNameAndAttribute.apply((parentNode||document.documentElement),['*','repeat','template']);for(var i=0,rt;i<repetitionTemplates.length;i++)$wf2.repetitionTemplate_constructor.apply(repetitionTemplates[i])},repetitionBlock_constructor:function(){if(this._initialized)return;this.style.display='';this.repetitionType=RepetitionElement.REPETITION_BLOCK;var _attr;this.repetitionIndex=/^\d+$/.test(_attr=this.getAttribute('repeat'))?parseInt(_attr):0;this.repetitionBlocks=null;this.repetitionTemplate=null;var node;if((node=document.getElementById(this.getAttribute('repeat-template')))&&node.repetitionType==RepetitionElement.REPETITION_TEMPLATE){this.repetitionTemplate=node}else{node=this;while(node=node.nextSibling){if(node.repetitionType==RepetitionElement.REPETITION_TEMPLATE){this.repetitionTemplate=node;break}}}if(!this.removeRepetitionBlock)this.removeRepetitionBlock=function(){return $wf2.removeRepetitionBlock.apply(this);};if(!this.moveRepetitionBlock)this.moveRepetitionBlock=function(distance){return $wf2.moveRepetitionBlock.apply(this,[distance]);};this._initialized=true},initRepetitionBlocks:function(parentNode){var repetitionBlocks=$wf2.getElementsByTagNameAndAttribute.apply((parentNode||document.documentElement),['*','repeat','template',true]);for(var i=0;i<repetitionBlocks.length;i++)$wf2.repetitionBlock_constructor.apply(repetitionBlocks[i])},repetitionButtonDefaultLabels:{'add':"Add",'remove':"Remove",'move-up':"Move-up",'move-down':"Move-down"},repetitionButton_constructor:function(btnType){if(this._initialized)return;this.htmlTemplate=$wf2.getHtmlTemplate(this);if(!this.firstChild)this.appendChild(document.createTextNode($wf2.repetitionButtonDefaultLabels[btnType]));if(btnType!='add')this.disabled=!$wf2.getRepetitionBlock(this);else{var rb;this.disabled=!(((rb=$wf2.getRepetitionBlock(this))&&rb.repetitionTemplate)||this.htmlTemplate)}if(this.addEventListener)this.addEventListener('click',$wf2.repetitionButton_click,false);else if(this.attachEvent)this.attachEvent('onclick',$wf2.repetitionButton_click);else this.onclick=$wf2.repetitionButton_click;this._initialized=true},initRepetitionButtons:function(btnType,parentNode){var i;if(!parentNode)parentNode=document.documentElement;var inputs=$wf2.getElementsByTagNameAndAttribute.apply(parentNode,['input','type',btnType]);for(i=0;i<inputs.length;i++){var btn=document.createElement('button');for(var j=0,attr;attr=inputs[i].attributes[j];j++)btn.setAttribute(attr.nodeName,inputs[i].getAttribute(attr.nodeName));inputs[i].parentNode.replaceChild(btn,inputs[i]);btn=null}var buttons=$wf2.getElementsByTagNameAndAttribute.apply(parentNode,['button','type',btnType]);for(var i=0;i<buttons.length;i++)$wf2.repetitionButton_constructor.apply(buttons[i],[btnType])},repetitionButton_click:function(e){if(e&&e.preventDefault)e.preventDefault();var btn;if(e&&e.target)btn=e.target;else if(window.event)btn=window.event.srcElement;else if(this.nodeName.toLowerCase()=='button')btn=this;var btnType=btn.getAttribute('type');if(btn.returnValue!==undefined&&!btn.returnValue){btn.returnValue=undefined;return false}if(btn.onclick){btn._onclick=btn.onclick;btn.onclick=null}if(btn._onclick&&btn.returnValue===undefined){btn.returnValue=btn._onclick(e);if(btn.returnValue!==undefined&&!btn.returnValue){btn.returnValue=undefined;return false}}btn.returnValue=undefined;var block;if(btnType!='add'){block=$wf2.getRepetitionBlock(btn);this.disabled=!block;if(block){if(btnType.indexOf("move")===0){block._clickedMoveBtn=btn;block.moveRepetitionBlock(btnType=='move-up'?-1:1)}else if(btnType=='remove'){block.removeRepetitionBlock()}}}else{var rt;if(btn.htmlTemplate)rt=btn.htmlTemplate;else{block=$wf2.getRepetitionBlock(btn);if(block&&block.repetitionTemplate)rt=block.repetitionTemplate}if(rt)rt.addRepetitionBlock();else btn.disabled=true;}return false},addRepetitionBlock:function(refNode,index){if(this.repetitionType!=RepetitionElement.REPETITION_TEMPLATE)throw $wf2.DOMException(9);if(this.parentNode==null)return null;var node=this;while(node=node.parentNode){if(node.repetitionType==RepetitionElement.REPETITION_TEMPLATE)return false}var sibling=this.previousSibling;var currentBlockCount=0;while(sibling!=null){if(sibling.repetitionType==RepetitionElement.REPETITION_BLOCK&&sibling.repetitionTemplate==this){this.repetitionIndex=Math.max(this.repetitionIndex,sibling.repetitionIndex+1);currentBlockCount++}sibling=sibling.previousSibling}if(this.repeatMax<=currentBlockCount)return null;if(index!==undefined&&index>this.repetitionIndex)this.repetitionIndex=index;var IDAttrName=this.getAttribute('id')?'id':this.getAttribute('name')?'name':'';var IDAttrValue=this.getAttribute(IDAttrName);var block;var replaceValue=this.repetitionIndex;var reTemplateName,_processAttr;if(IDAttrValue&&!/\u005B|\u02D1|\u005D|\u00B7/.test(IDAttrValue)){reTemplateName=new RegExp("(\\[|\u02D1)"+IDAttrValue+"(\\]|\u00B7)",'g');_processAttr=function(attrVal){if(!attrVal)return attrVal;attrVal=attrVal.toString();if(attrVal.indexOf("\uFEFF")===0)return attrVal.replace(/^\uFEFF/,'');return attrVal.replace(reTemplateName,replaceValue)}}block=$wf2.cloneNode(this,_processAttr);block._initialized=false;reTemplateName=null;block.setAttribute('repeat',this.repetitionIndex);block.removeAttribute('repeat-min');block.removeAttribute('repeat-max');block.removeAttribute('repeat-start');if(IDAttrName){block.setAttribute('repeat-template',IDAttrValue);block.removeAttribute(IDAttrName)}if(!refNode){refNode=this;while(refNode.previousSibling&&refNode.previousSibling.repetitionType!=RepetitionElement.REPETITION_BLOCK)refNode=refNode.previousSibling;this.parentNode.insertBefore(block,refNode);this.repetitionBlocks.push(block)}else{refNode.parentNode.insertBefore(block,refNode.nextSibling);this.repetitionBlocks.push(block);if(this.repetitionBlocks[0].sourceIndex){this.repetitionBlocks.sort(function(a,b){return a.sourceIndex-b.sourceIndex})}else if(this.repetitionBlocks[0].compareDocumentPosition){this.repetitionBlocks.sort(function(a,b){return 3-(a.compareDocumentPosition(b)&6)})}}this.repetitionIndex++;$wf2.repetitionBlock_constructor.apply(block);$wf2.initRepetitionTemplates(block);$wf2.initRepetitionButtons('add',block);$wf2.initRepetitionButtons('remove',block);$wf2.initRepetitionButtons('move-up',block);$wf2.initRepetitionButtons('move-down',block);if($wf2.isInitialized){$wf2.updateAddButtons(this);$wf2.updateMoveButtons(this.parentNode)}$wf2.initWF2Functionality(block);var addEvt;try{if(document.createEvent)addEvt=document.createEvent("UIEvents");else if(document.createEventObject)addEvt=document.createEventObject();RepetitionEvent._upgradeEvent.apply(addEvt);addEvt.initRepetitionEvent("added",true,false,block);if(this.dispatchEvent)this.dispatchEvent(addEvt);else if(this.fireEvent){}}catch(err){addEvt=new Object();RepetitionEvent._upgradeEvent.apply(addEvt);addEvt.initRepetitionEvent("added",true,false,block)}var onaddAttr=this.getAttribute('onadd')||this.getAttribute('onadded');if(onaddAttr&&(!this.onadd||typeof this.onadd!='function'))this.onadd=new Function('event',onaddAttr);try{if(this.onadd){this.onadd.apply(this,[addEvt]);}else if(this.onadded){this.onadded.apply(this,[addEvt])}}catch(err){setTimeout(function(){throw err},0);}return block},addRepetitionBlockByIndex:function(refNode,index){$wf2.addRepetitionBlock.apply(this,[refNode,index])},removeRepetitionBlock:function(){if(this.repetitionType!=RepetitionElement.REPETITION_BLOCK)throw $wf2.DOMException(9);var parentNode=this.parentNode;var block=parentNode.removeChild(this);$wf2.updateMoveButtons(parentNode);if(this.repetitionTemplate!=null){for(var i=0;i<this.repetitionTemplate.repetitionBlocks.length;i++){if(this.repetitionTemplate.repetitionBlocks[i]==this){this.repetitionTemplate.repetitionBlocks.splice(i,1);break}}}if(this.repetitionTemplate!=null){var removeEvt;try{if(document.createEvent)removeEvt=document.createEvent("UIEvents");else if(document.createEventObject)removeEvt=document.createEventObject();RepetitionEvent._upgradeEvent.apply(removeEvt);removeEvt.initRepetitionEvent("removed",true,false,this);if(this.repetitionTemplate.dispatchEvent)this.repetitionTemplate.dispatchEvent(removeEvt);else if(this.repetitionTemplate.fireEvent){}}catch(err){removeEvt=new Object();RepetitionEvent._upgradeEvent.apply(removeEvt);removeEvt.initRepetitionEvent("removed",true,false,this)}var onremoveAttr=this.repetitionTemplate.getAttribute('onremove')||this.repetitionTemplate.getAttribute('onremoved');if(onremoveAttr&&(!this.repetitionTemplate.onremove||typeof this.repetitionTemplate.onremove!='function'))this.repetitionTemplate.onremove=new Function('event',onremoveAttr);try{if(this.repetitionTemplate.onremove){this.repetitionTemplate.onremove.apply(this,[removeEvt]);}else if(this.repetitionTemplate.onremoved){this.repetitionTemplate.onremoved.apply(this,[removeEvt])}}catch(err){setTimeout(function(){throw err},0)}}if(this.repetitionTemplate!=null){if(this.repetitionTemplate.repetitionBlocks.length<this.repetitionTemplate.repeatMin&&this.repetitionTemplate.repetitionBlocks.length<this.repetitionTemplate.repeatMax){this.repetitionTemplate.addRepetitionBlock()}if(this.repetitionTemplate.repetitionBlocks.length<this.repetitionTemplate.repeatMax){var addBtns=$wf2.getElementsByTagNameAndAttribute.apply(document.documentElement,['button','type','add']);for(i=0;i<addBtns.length;i++){if(addBtns[i].htmlTemplate==this.repetitionTemplate)addBtns[i].disabled=false}}}},moveRepetitionBlock:function(distance){if(this.repetitionType!=RepetitionElement.REPETITION_BLOCK)throw $wf2.DOMException(9);if(distance==0||this.parentNode==null)return;var target=this;if(this.repetitionTemplate){var pos=0;var rp=this.repetitionTemplate.repetitionBlocks;while(pos<rp.length&&rp[pos]!=this)pos++;rp.splice(pos,1);rp.splice(distance<0?Math.max(pos+distance,0):Math.min(pos+distance,rp.length),0,this)}if(distance<0){while(distance!=0&&target.previousSibling&&target.previousSibling.repetitionType!=RepetitionElement.REPETITION_TEMPLATE){target=target.previousSibling;if(target.repetitionType==RepetitionElement.REPETITION_BLOCK)distance++}}else{while(distance!=0&&target.nextSibling&&target.nextSibling.repetitionType!=RepetitionElement.REPETITION_TEMPLATE){target=target.nextSibling;if(target.repetitionType==RepetitionElement.REPETITION_BLOCK)distance--}target=target.nextSibling}this.parentNode.insertBefore(this,target);if(this._clickedMoveBtn){this._clickedMoveBtn.focus();this._clickedMoveBtn=null}$wf2.updateMoveButtons(this.parentNode);if(this.repetitionTemplate!=null){var moveEvt;try{if(document.createEvent)moveEvt=document.createEvent("UIEvents");else if(document.createEventObject)moveEvt=document.createEventObject();RepetitionEvent._upgradeEvent.apply(moveEvt);moveEvt.initRepetitionEvent("moved",true,false,this);if(this.repetitionTemplate.dispatchEvent)this.repetitionTemplate.dispatchEvent(moveEvt);else if(this.repetitionTemplate.fireEvent){}}catch(err){moveEvt=new Object();RepetitionEvent._upgradeEvent.apply(moveEvt);moveEvt.initRepetitionEvent("moved",true,false,this)}var onmoveAttr=this.repetitionTemplate.getAttribute('onmove')||this.repetitionTemplate.getAttribute('onmoved');var funcMatches;if(typeof onmoveAttr=='function'&&(funcMatches=onmoveAttr.toString().match(/^\s*function\s+anonymous\(\s*\)\s*\{((?:.|\n)+)\}\s*$/))){this.repetitionTemplate.onmove=new Function('event',funcMatches[1])}if(onmoveAttr&&!this.repetitionTemplate.onmove)this.repetitionTemplate.onmove=new Function('event',onmoveAttr);try{if(this.repetitionTemplate.onmove){this.repetitionTemplate.onmove.apply(this,[moveEvt])}else if(this.repetitionTemplate.onmoved){this.repetitionTemplate.onmoved.apply(this,[moveEvt])}}catch(err){setTimeout(function(){throw err},0);}}},formCheckValidity:function(){var i,el,valid=true;var _elements=[];for(i=0;i<this.elements.length;i++)_elements.push(this.elements[i]);for(i=0;el=_elements[i];i++){if(el.checkValidity&&el.willValidate==true){if(!el.checkValidity())valid=false}}if(!valid&&$wf2.invalidIndicators.length){$wf2.invalidIndicators[0].errorMsg.className+=" wf2_firstErrorMsg";el=$wf2.invalidIndicators[0].target;if(el.style.display=='none'||!el.offsetParent){while(el&&(el.nodeType!=1||(el.style.display=='none'||!el.offsetParent)))el=el.previousSibling;var cur=el;var top=0;if(cur&&cur.offsetParent){top=cur.offsetTop;while(cur=cur.offsetParent)top+=cur.offsetTop}window.scrollTo(0,top)}else el.focus()}return valid},controlCheckValidity:function(){$wf2.updateValidityState(this);if(this.validity.valid)return true;var canceled=false;var evt;try{if(document.createEvent)evt=document.createEvent("Events");else if(document.createEventObject)evt=document.createEventObject();evt.initEvent("invalid",true,true);evt.srcElement=this;if(this.dispatchEvent)canceled=!this.dispatchEvent(evt);else if(this.fireEvent){}}catch(err){evt=new Object();if(evt.initEvent)evt.initEvent("invalid",true,true);else{evt.type="invalid";evt.cancelBubble=false}evt.target=evt.srcElement=this}var oninvalidAttr=this.getAttribute('oninvalid');if(oninvalidAttr&&(!this.oninvalid||typeof this.oninvalid!='function'))this.oninvalid=new Function('event',oninvalidAttr);try{if(this.oninvalid){canceled=this.oninvalid.apply(this,[evt])===false||canceled;}}catch(err){setTimeout(function(){throw err},0)}if(!canceled)$wf2.addInvalidIndicator(this);return false},updateValidityState:function(node){node.validity.valueMissing=Boolean(node.getAttributeNode('required')&&(node.options?node.selectedIndex==-1:!node.value));if(!node.validity.valueMissing){if(!node.value){node.validity={typeMismatch:false,rangeUnderflow:false,rangeOverflow:false,stepMismatch:false,tooLong:false,patternMismatch:false,valueMissing:false,customError:false,valid:true}}else{var pattern;if(pattern=node.getAttribute('pattern')){if(!/^\^/.test(pattern))pattern="^"+pattern;if(!/\$$/.test(pattern))pattern+="$";var rePattern=new RegExp(pattern);node.validity.patternMismatch=(rePattern?!rePattern.test(node.value):false)}var step,min,max;if(/^-?\d+(.\d+)?(e-?\d+)?$/.test(String(node.getAttribute("step"))))step=Number(node.getAttribute("step"));if(/^-?\d+(.\d+)?(e-?\d+)?$/.test(String(node.getAttribute("min"))))min=Number(node.getAttribute("min"));if(/^-?\d+(.\d+)?(e-?\d+)?$/.test(String(node.getAttribute("max"))))max=Number(node.getAttribute("max"));var type=node.getAttribute('type');switch(type){case'date':case'datetime':case'datetime-local':var regexp="(\d\d\d\d)(-(0\d|1[0-2])(-(0\d|[1-2]\d|3[0-1])"+"(T(0\d|1\d|2[0-4]):([0-5]\d)(:([0-5]\d)(\.(\d+))?)?"+"(Z)?";var d=string.match(new RegExp(regexp));if(!d){node.validity.typeMismatch=true;break}if(d[5]){var date=new Date(d[1],d[3]-1,d[5]);if(date.getMonth()!=d[3]-1){node.validity.typeMismatch=true;break}}switch(type){case'date':if(d[6])node.validity.typeMismatch=true;break;case'datetime':if(!d[14])node.validity.typeMismatch=true;break;case'datetime-local':if(d[14])node.validity.typeMismatch=true;break}if(node.getAttribute("step")!='any'){if(step==undefined)step=60;}break;case'month':node.validity.typeMismatch=!/^\d\d\d\d-(0\d|1[0-2])$/.test(node.value);break;case'week':node.validity.typeMismatch=!/^\d\d\d\d-W(0[1-9]|[1-4]\d|5[0-2])$/.test(node.value);break;case'time':node.validity.typeMismatch=!/^(0\d|1\d|2[0-4]):[0-5]\d(:[0-5]\d(.\d+)?)?$/.test(node.value);break;case'number':case'range':node.validity.typeMismatch=!/^-?\d+(.\d+)?(e-?\d+)?$/.test(node.value);if(!node.validity.typeMismatch&&node.getAttribute("step")!='any'){if(step==undefined)step=1;var val=Number(node.value);node.validity.stepMismatch=(val==parseInt(val)&&step!=parseInt(step));node.validity.rangeUnderflow=(min!=undefined&&val<min);node.validity.rangeOverflow=(max!=undefined&&val>max)}break;case'email':node.validity.typeMismatch=!/^.+@.+$/.test(node.value);break;case'url':node.validity.typeMismatch=!/^(http|ftp):\/\/.+$/i.test(node.value);break}}}if(node.maxlength&&node.value!=node.defaultValue){var shortNewlines=0;var v=node.value;node.wf2ValueLength=v.length;for(var i=1;i<v.length;i++){if(v[i]==="\x0A"&&v[i-1]!=="\x0D"||v[i]=="\x0D"&&(v[i+1]&&v[i+1]!=="\x0A"))node.wf2ValueLength++}node.validity.tooLong=node.wf2ValueLength>node.maxlength}node.validity.valid=!(node.validity.typeMismatch||node.validity.rangeUnderflow||node.validity.rangeOverflow||node.validity.tooLong||node.validity.patternMismatch||node.validity.valueMissing||node.validity.customError);},applyValidityInterface:function(node){if(node.validity&&node.validity.typeMismatch!==undefined)return node;node.validationMessage="";node.validity={typeMismatch:false,rangeUnderflow:false,rangeOverflow:false,stepMismatch:false,tooLong:false,patternMismatch:false,valueMissing:false,customError:false,valid:true};node.willValidate=true;var nodeName=node.nodeName.toLowerCase();if(nodeName=='button'||nodeName=='fieldset'){node.setCustomValidity=function(error){throw $wf2.DOMException(9);}node.checkValidity=function(){return true}return node}node.setCustomValidity=$wf2.controlSetCustomValidity;node.checkValidity=$wf2.controlCheckValidity;if(/(hidden|button|reset|add|remove|move-up|move-down)/.test(node.getAttribute('type'))||!node.name||node.disabled)node.willValidate=false;else if(window.RepetitionElement){var parent=node;while(parent=parent.parentNode){if(parent.repetitionType==RepetitionElement.REPETITION_TEMPLATE){node.willValidate=false;break}}}return node},onsubmitValidityHandler:function(event){var form=event.currentTarget||event.srcElement;if(!form.checkValidity()){if(event.preventDefault)event.preventDefault();event.returnValue=false return false}event.returnValue=true;return true},controlSetCustomValidity:function(error){if(error){this.validationMessage=String(error);this.validity.customError=true}else{this.validationMessage="";this.validity.customError=false}this.validity.valid=!(this.validity.typeMismatch||this.validity.rangeUnderflow||this.validity.rangeOverflow||this.validity.tooLong||this.validity.patternMismatch||this.validity.valueMissing||this.validity.customError)},invalidIndicators:[],indicatorTimeoutId:null,indicatorIntervalId:null,addInvalidIndicator:function(target){var msg=document.createElement('div');msg.className="wf2_errorMsg";msg.id=(target.id||target.name)+"_wf2_errorMsg";msg.onmousedown=function(){this.parentNode.removeChild(this)};var ol=document.createElement('ol');if(target.validity.valueMissing)ol.appendChild($wf2.createLI('The value must be supplied.'));if(target.validity.typeMismatch)ol.appendChild($wf2.createLI("The value is invalid for the type '"+target.getAttribute('type')+"'."));if(target.validity.rangeUnderflow)ol.appendChild($wf2.createLI('The value must be greater than '+target.getAttribute('min')+"."));if(target.validity.rangeOverflow)ol.appendChild($wf2.createLI('The value must be less than '+target.getAttribute('min')+"."));if(target.validity.stepMismatch)ol.appendChild($wf2.createLI('The value has a step mismatch; it must be a value by adding multiples of '+target.getAttribute('step')+" to "+target.getAttribute('min')+"."));if(target.validity.tooLong)ol.appendChild($wf2.createLI('The value is too long. The field may have a maximum of '+target.maxlength+' characters but you supplied '+(target.wf2ValueLength?target.wf2ValueLength:target.value.length)+'. Note that each line-break counts as two characters.'));if(target.validity.patternMismatch)ol.appendChild($wf2.createLI('The value does not match the pattern (regular expression) "'+target.getAttribute('pattern')+'".'));if(target.validity.customError)ol.appendChild($wf2.createLI(target.validationMessage));if(ol.childNodes.length==1)ol.className="single";msg.appendChild(ol);var parent=document.body?document.body:document.documentElement;if($wf2.invalidIndicators.length)parent.insertBefore(msg,$wf2.invalidIndicators[$wf2.invalidIndicators.length-1].errorMsg);elseparent.insertBefore(msg,null);var el=target;while(el&&(el.nodeType!=1||(el.style.display=='none'||el.style.visibility=='hidden'||!el.offsetParent)))el=el.parentNode;var top=left=0;var cur=el;if(cur&&cur.offsetParent){left=cur.offsetLeft;top=cur.offsetTop;while(cur=cur.offsetParent){left+=cur.offsetLeft;top+=cur.offsetTop}top+=el.offsetHeight}msg.style.top=top+"px";msg.style.left=left+"px";$wf2.invalidIndicators.push({target:target,errorMsg:msg});if(!target.className.match(/\bwf2_invalid\b/))target.className+=" wf2_invalid";if($wf2.indicatorIntervalId==null){$wf2.indicatorIntervalId=setInterval(function(){var invalidIndicator;for(var i=0;invalidIndicator=$wf2.invalidIndicators[i];i++){if(!invalidIndicator.target.className.match(/\bwf2_invalid\b/)){invalidIndicator.target.className+=" wf2_invalid"}else{invalidIndicator.target.className=invalidIndicator.target.className.replace(/\s?wf2_invalid/,"")}}},500);$wf2.indicatorTimeoutId=setTimeout($wf2.clearInvalidIndicators,4000)}},clearInvalidIndicators:function(){window.clearTimeout($wf2.indicatorTimeoutId);$wf2.indicatorTimeoutId=null;window.clearInterval($wf2.indicatorIntervalId);$wf2.indicatorIntervalId=null;var invalidIndicator;while(invalidIndicator=$wf2.invalidIndicators[0]){if(invalidIndicator.errorMsg&&invalidIndicator.errorMsg.parentNode)invalidIndicator.errorMsg.parentNode.removeChild(invalidIndicator.errorMsg);invalidIndicator.target.className=invalidIndicator.target.className.replace(/\s?wf2_invalid/,"");$wf2.invalidIndicators.shift()}},cloneNode_customAttrs:{'type':1,'template':1,'repeat':1,'repeat-template':1,'repeat-min':1,'repeat-max':1,'repeat-start':1,'value':1,'class':1,'required':1,'pattern':1,'form':1,'autocomplete':1,'autofocus':1,'inputmode':1},cloneNode_skippedAttrs:{'name':1,'class':1,'for':1,'style':1,onadd:1,onremove:1,onmove:1,onmoved:1,onadded:1,onremoved:1,addRepetitionBlock:1,addRepetitionBlockByIndex:1,moveRepetitionBlock:1,removeRepetitionBlock:1,repetitionBlocks:1,_initialized:1},cloneNode:function(node,processAttr){var clone,i,attr,el;if(node.nodeType==1){clone=node.name?$wf2.createElementWithName(node.nodeName,(processAttr?processAttr(node.name):node.name)):document.createElement(node.nodeName);for(i=0;attr=node.attributes[i];i++){if((attr.specified||$wf2.cloneNode_customAttrs[attr.name])&&!$wf2.cloneNode_skippedAttrs[attr.name]){if((attr.name.indexOf("on")===0)&&(typeof node[attr.name]=='function')){var funcBody=processAttr(node[attr.name].toString().match(/{((?:.|\n)+)}/)[1]);funcBody=processAttr(funcBody);clone[attr.name]=new Function('event',funcBody)}else{var attrValue=node.getAttribute(attr.name);attrValue=(processAttr?processAttr(attrValue):attrValue);clone.setAttribute(attr.name,attrValue)}}}if(node.className){var _className=(processAttr?processAttr(node.className):node.className);if(clone.getAttributeNode('class')){for(i=0;i<clone.attributes.length;i++){if(clone.attributes[i].name=='class')clone.attributes[i].value=_className}}else clone.setAttribute('class',_className)}if(!/\bdisabled\b/.test(node.className))clone.disabled=false;if(node.style){clone.style.cssText=(processAttr?processAttr(node.style.cssText):node.style.cssText)}if(node.nodeName.toLowerCase()=='label'&&node.htmlFor)clone.htmlFor=(processAttr?processAttr(node.htmlFor):node.htmlFor);for(i=0;el=node.childNodes[i];i++)clone.appendChild($wf2.cloneNode(el,processAttr))}else clone=node.cloneNode(true);return clone},getRepetitionBlock:function(node){while(node=node.parentNode){if(node.repetitionType==RepetitionElement.REPETITION_BLOCK){return node}}return null},getHtmlTemplate:function(button){var attr=button.getAttribute('template');var node;if(attr&&(node=document.getElementById(attr))&&node.repetitionType==RepetitionElement.REPETITION_TEMPLATE)return node;return null},updateAddButtons:function(rt){var repetitionTemplates=rt?[rt]:$wf2.repetitionTemplates;var btns=$wf2.getElementsByTagNameAndAttribute.apply(document.documentElement,['button','type','add']);for(var i=0;i<btns.length;i++){for(var t,j=0;t=repetitionTemplates[j];j++){if(btns[i].htmlTemplate==t&&t.repetitionBlocks.length>=t.repeatMax){btns[i].disabled=true}}}},updateMoveButtons:function(parentNode){var i;var repetitionBlocks=[];if(!parentNode){var visitedParents=[];var repetitionBlocks=$wf2.getElementsByTagNameAndAttribute.apply(document.documentElement,['*','repeat','template',true]);for(i=0;block=repetitionBlocks[i];i++){if(!$wf2.arrayHasItem(visitedParents,block.parentNode)){$wf2.updateMoveButtons(block.parentNode);visitedParents.push(block.parentNode)}}return}var j,btn,block;var child=parentNode.firstChild;while(child){if(child.repetitionType==RepetitionElement.REPETITION_BLOCK)repetitionBlocks.push(child);child=child.nextSibling}for(i=0;block=repetitionBlocks[i];i++){var moveUpBtns=$wf2.getElementsByTagNameAndAttribute.apply(block,['button','type','move-up']);for(j=0;btn=moveUpBtns[j];j++){btn.disabled=!(rb=$wf2.getRepetitionBlock(btn))||(i==0)}var moveDownBtns=$wf2.getElementsByTagNameAndAttribute.apply(block,['button','type','move-down']);for(j=0;btn=moveDownBtns[j];j++){btn.disabled=!(rb=$wf2.getRepetitionBlock(btn))||(i==repetitionBlocks.length-1)}}},getElementsByTagNames:function(){var els,i,results=[];if(document.evaluate){var _tagNames=[];for(i=0;i<arguments.length;i++)_tagNames.push(".//"+arguments[i]);els=document.evaluate(_tagNames.join('|'),this,null,XPathResult.ORDERED_NODE_SNAPSHOT_TYPE,null);for(i=0;i<els.snapshotLength;i++)results.push(els.snapshotItem(i))}else{for(i=0;i<arguments.length;i++){els=this.getElementsByTagName(arguments[i]);for(var j=0;j<els.length;j++){results.push(els[j])}}if(!results.length)return[];if($wf2.sortNodes)results.sort($wf2.sortNodes)}return results},getElementsByTagNameAndAttribute:function(elName,attrName,attrValue,isNotEqual){var els,i,results=[];if(document.evaluate){els=document.evaluate(".//"+elName+"[@"+attrName+(attrValue?(isNotEqual?'!=':'=')+'"'+attrValue+'"':"")+"]",this,null,XPathResult.ORDERED_NODE_SNAPSHOT_TYPE,null);for(i=0;i<els.snapshotLength;i++)results.push(els.snapshotItem(i))}else{els=this.getElementsByTagName(elName);for(i=0;i<els.length;i++){var thisAttrNode=els[i].getAttributeNode(attrName);var thisAttrValue=els[i].getAttribute(attrName);if(thisAttrNode&&(attrValue===undefined||(isNotEqual?thisAttrValue!=attrValue:thisAttrValue==attrValue))){results.push(els[i])}}}return results},arrayHasItem:function(arr,item){for(var i=0;i<arr.length;i++){if(arr[i]==item)return true}return false},getElementStyle:function(el,property){if(el.currentStyle)return el.currentStyle[property];else if(window.getComputedStyle)return window.getComputedStyle(el,"").getPropertyValue(property);else if(el.style)return el.style[property];else return''},createMiscFunctions:function(){var el;try{el=document.createElement('<div name="foo">');if(el.tagName.toLowerCase()=='div'||el.name!='foo'){throw'create element error'}$wf2.createElementWithName=function(tag,name){return document.createElement('<'+tag+' name="'+name+'"></'+tag+'>')}}catch(err){el=null;$wf2.createElementWithName=function(tag,name){var el=document.createElement(tag);el.setAttribute('name',name);return el}}var n=document.documentElement.firstChild;if(n.sourceIndex){$wf2.sortNodes=function(a,b){return a.sourceIndex-b.sourceIndex}}else if(n.compareDocumentPosition){$wf2.sortNodes=function(a,b){return 3-(a.compareDocumentPosition(b)&6)}}},createLI:function(text){var li=document.createElement('li');li.appendChild(document.createTextNode(text));return li}};$wf2.DOMException=function(code){var err=new Error("DOMException: ");err.code=code;err.name="DOMException";err.INDEX_SIZE_ERR=1;err.NOT_SUPPORTED_ERR=9;err.INVALID_STATE_ERR=11;err.SYNTAX_ERR=12;err.INVALID_MODIFICATION_ERR=13;switch(code){case 1:err.message+="INDEX_SIZE_ERR";break;case 9:err.message+="NOT_SUPPORTED_ERR";break;case 11:err.message+="INVALID_STATE_ERR";break;case 12:err.message+="SYNTAX_ERR";break;case 13:err.message+="INVALID_MODIFICATION_ERR";break}return err};var RepetitionEvent={_upgradeEvent:function(){this.initRepetitionEvent=RepetitionEvent.initRepetitionEvent;this.initRepetitionEventNS=RepetitionEvent.initRepetitionEventNS},initRepetitionEvent:function(typeArg,canBubbleArg,cancelableArg,elementArg){if(this.initEvent)this.initEvent(typeArg,canBubbleArg,cancelableArg);else{this.type=typeArg;if(!this.preventDefault)this.preventDefault=function(){this.returnValue=false};if(!this.stopPropagation)this.stopPropagation=function(){this.cancelBubble=true}}this.element=elementArg;this.relatedNode=elementArg;},initRepetitionEventNS:function(namespaceURIArg,typeArg,canBubbleArg,cancelableArg,elementArg){throw Error("NOT IMPLEMENTED: RepetitionEvent.initRepetitionEventNS");}};(function(){var match;var scripts=document.getElementsByTagName('script');for(var i=0;i<scripts.length;i++){if(match=scripts[i].src.match(/^(.*)webforms2[^\/]+$/))$wf2.libpath=match[1]}if(document.addEventListener){document.addEventListener("DOMNodeInsertedIntoDocument",function(evt){if(evt.target.nodeType==1&&evt.target.hasAttribute("autofocus")){$wf2.initAutofocusElement(evt.target)}},false)document.addEventListener("DOMAttrModified",function(evt){if(evt.attrName=="autofocus"){if(evt.attrChange==evt.ADDITION)$wf2.initAutofocusElement(evt.target);else if(evt.attrChange==evt.REMOVAL)evt.target.autofocus=false}},false)}if(document.body){$wf2.init();return}var eventSet=0;if(document.addEventListener){document.addEventListener("DOMContentLoaded",function(){$wf2.init()},false);window.addEventListener("load",function(){$wf2.init()},false);eventSet=1}if(/WebKit/i.test(navigator.userAgent)){var _timer=setInterval(function(){if(/loaded|complete/.test(document.readyState)){clearInterval(_timer);delete _timer;$wf2.init()}},10);eventSet=1}else if(/MSIE/i.test(navigator.userAgent)&&!document.addEventListener&&window.attachEvent){window.attachEvent("onload",function(){$wf2.init()});document.write("<script defer src='"+$wf2.libpath+"webforms2-msie.js'><"+"/script>");document.write("<scr"+"ipt id='__wf2_ie_onload' defer src='//:'><\/script>");var script=document.getElementById("__wf2_ie_onload");script.onreadystatechange=function(){if(this.readyState=="complete"){this.parentNode.removeChild(this);$wf2.init();if($wf2.repetitionTemplates.length==0)$wf2.isInitialized=false}};script=null;eventSet=1}if(!eventSet){if(window.onload){var oldonload=window.onload;window.onload=function(){$wf2.init();oldonload()}}else window.onload=function(){$wf2.init()}}})()}else if(document.addEventListener&&($wf2.oldRepetitionEventModelEnabled===undefined||$wf2.oldRepetitionEventModelEnabled)){$wf2.oldRepetitionEventModelEnabled=true;(function(){var baseName={added:"add",removed:"remove",moved:"move"};function handleRepetitionEvent(evt){if(!RepetitionElement.oldEventModelEnabled)return;if(!evt.element&&evt.relatedNode)evt.element=evt.relatedNode;if(!evt.element||!evt.element.repetitionTemplate)return;var rt=evt.element.repetitionTemplate;var attrName='on'+baseName[evt.type];var attrNameDeprecated='on'+evt.type;var handlerAttr=rt.getAttribute(attrName)||rt.getAttribute(attrNameDeprecated);if(handlerAttr&&(!rt[attrName]||typeof rt[attrName]!='function'))rt[attrName]=new Function('event',handlerAttr);if(evt.element.repetitionTemplate[attrName])evt.element.repetitionTemplate[attrName](evt);else if(evt.element.repetitionTemplate[attrNameDeprecated])evt.element.repetitionTemplate[attrNameDeprecated](evt)}document.addEventListener("added",handleRepetitionEvent,false);document.addEventListener("removed",handleRepetitionEvent,false);document.addEventListener("moved",handleRepetitionEvent,false)})()}}

