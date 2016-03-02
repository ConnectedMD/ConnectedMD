/*jshint esnext: true */
/* common javascript */
window.fitViewport = function () {
	$(".fitViewport").each(function (index) {
		var o = $(this).offset();
		var n = $(window).height() - (o.top <=57 ? 57 : o.top);
		if (n < 100) { n = 100 } // temp fix to deal with flow layout issues
		if ($(this).height() != n) { $(this).height(n + "px"); }
	});
	/* override for things that don't fit */
	$("#adminConfigScroll").height(($(window).height() - 185) + "px");
	return "";
};
window.initScrollbar = function () {
	fitViewport();
	$(".scrollbar").each(function (index) {
		try { Ps.destroy(this); } catch (e) { }
		/* load attrb values */
		var options = {};
		if ($(this).attr("wheel-speed") !== undefined) { options.wheelSpeed = $(this).attr("wheel-speed"); }
		if ($(this).attr("wheel-propagation") !== undefined) { options.wheelPropagation = $(this).attr("wheel-propagation"); }
		if ($(this).attr("swipe-propagation") !== undefined) { options.swipePropagation = $(this).attr("swipe-propagation"); }
		if ($(this).attr("min-scrollbar-length") !== undefined) { options.minScrollbarLength = $(this).attr("min-scrollbar-length"); }
		if ($(this).attr("max-scrollbar-length") !== undefined) { options.maxScrollbarLength = $(this).attr("max-scrollbar-length"); }
		if ($(this).attr("suppress-scroll-x") !== undefined) { options.suppressScrollX = $(this).attr("suppress-scroll-x"); }
		if ($(this).attr("suppress-scroll-y") !== undefined) { options.suppressScrollY = $(this).attr("suppress-scroll-y"); }
		if ($(this).attr("scroll-x-margin-offset") !== undefined) { options.scrollXMarginOffset = $(this).attr("scroll-x-margin-offset"); }
		if ($(this).attr("scroll-y-margin-offset") !== undefined) { options.scrollYMarginOffset = $(this).attr("scroll-y-margin-offset"); }
		/* init perfect scrollbar */
		Ps.initialize(this, options);
		/* attach for html changes */
		if ($._data($(this)[0], 'events') !== undefined) {
			var mouseover = $._data($(this)[0], 'events').mouseover;
			var hasEvent = false;
			$.each(mouseover, function(index, value) { 
				if ( value.handler.toString().indexOf(".perfectScrollbar") > 0 ) { hasEvent = true; } 
			});
			if ( !hasEvent ) { $(this).on("mouseover", function() { fitViewport(); try { Ps.update(this); } catch (e) { } } ); }
		} else {
			$(this).on("mouseover", function() { fitViewport(); try { Ps.update(this); } catch (e) { } } );
		}
	});
};

$(window).resize(function() {
	fitViewport();
	//try { Ps.update(this); } catch (e) { }
});

function getCookie(name) { return (name = (document.cookie + ';').match(new RegExp(name + '=.*;'))) && name[0].split(/=|;/)[1]; }

function createCookie(name,value,days) {
	var expires = "";
	if (days) {
		var date = new Date();
		date.setTime(date.getTime()+(days*24*60*60*1000));
		expires = "; expires="+date.toGMTString();
	}
	document.cookie = name+"="+value+expires+"; path=/";
}

function guid() {
  function s4() { return Math.floor((1 + Math.random()) * 0x10000).toString(16).substring(1); }
  return s4() + s4() + '-' + s4() + '-' + s4() + '-' + s4() + '-' + s4() + s4() + s4();
}

/* PDF.js */
window.rawPDF = null; window.pdfDoc = null; window.pdfCanvas = null; window.pdfContext = null; 
window.pdfScale = 1.56; window.currentDocumentAction = ""; window.pdfPage = null; window.viewport = null;

window.renderPdfPage = function(pageNum, scale) {
	if (scale == undefined) { scale = window.pdfScale; }
	console.log("Render PDF");
	angular.element("#pdfPage").scope().docCtrl.pdfCurrentPage = pageNum;
	window.pdfDoc.getPage(pageNum).then(function(page) {
		var viewport = page.getViewport(scale);
      window.viewport = viewport;
      /* adjustments */
		window.pdfCanvas.height = viewport.height;
		window.pdfCanvas.width = viewport.width;
      /* fit overlay to canvas size */
		$("#eSignOverlay").css({width:viewport.width,height:viewport.height});
		var renderContext = { canvasContext: window.pdfContext, viewport: viewport };
		page.zoom = 200;
		page.render(renderContext).then(function() {
         window.pdfPage = page;
         angular.element("#pdfPage").scope().docCtrl.loadOverlay();
      });
	});
};

window.pdfThumb = null; window.pdfThumbContext = null;
window.renderPdfThumb = function() {
	console.log("Render PDF Thumbnail");
	window.pdfThumb = document.getElementById('pdfThumbnail');
	window.pdfThumbContext = window.pdfThumb.getContext('2d');
	window.pdfDoc.getPage(1).then(function(page) {
		var viewport = page.getViewport(0.135);
		window.pdfThumb.height = 123;
		window.pdfThumb.width = 84;
		var renderContext = { canvasContext: window.pdfThumbContext, viewport: viewport };
		page.zoom = 200;
		page.render(renderContext).then( function() {
			angular.element("#pdfPage").scope().docCtrl.addDocumentThumbnail(window.pdfThumb.toDataURL());
		});
	});
};

/* esign */
var dragOBJ, dropOBJ, allowDropOBJ, esignActive;

function esignAllowDrop(ev) { 
	allowDropOBJ = ev;
	allowDropOBJ.preventDefault();
}

function esignDrag(ev) {
	$("#esignElementMenu").hide();
	dragOBJ = ev;
	if (window.currentDocumentAction == "edit") {
		dragOBJ.dataTransfer.setData("text", ev.target.id);
	}
}

function esignDrop(ev) {
	dropOBJ = ev;
	dropOBJ.preventDefault();
	if (window.currentDocumentAction == "edit") {
		var dropbox = $("#pdfCanvas").offset();
		var top = dropOBJ.clientY;
		var left = dropOBJ.clientX;
		top = top - dropbox.top;	
		left = left - dropbox.left;	
		if (dragOBJ.target.id == "esignAnchor") {
         var type = $("#esignNewType").val();
         addFormElement(type, guid(), top + $(document).scrollTop(), left, $("#esignNewWidth").val(), 22, $("#esignNewRequired").is(":checked"), dropOBJ.target)
		} else {
			/* MOVE existing element */
			$(esignActive).css("top",(top + $(document).scrollTop())+"px");
			$(esignActive).css("left",left+"px");
		}
		angular.element("#pdfPage").scope().docCtrl.updateLayout();
	}
}	

function addFormElement(type, id, top, left, width, height, isRequired, objTarget) {
   var data;
   if (type == "date") {
      data = document.createElement("input");
      data.setAttribute("type","date");
      data.setAttribute("style","top:"+top+"px;left:"+left+"px;width:"+width+"px;height:"+height+"px;");
   }
   if (type == "text") {
      data = document.createElement("input");
      data.setAttribute("type","text");
      data.setAttribute("style","top:"+top+"px;left:"+left+"px;width:"+width+"px;height:"+height+"px;");
   }
   if (type == "textarea") {
      data = document.createElement("textarea");
      data.setAttribute("style","top:"+top+"px;left:"+left+"px;width:"+width+"px;height:"+height+"px;");
   }
   if (type == "number") {
      data = document.createElement("input");
      data.setAttribute("type","number");
      data.setAttribute("style","top:"+top+"px;left:"+left+"px;width:"+width+"px;height:"+height+"px;");
   }
   if (type == "checkbox") {
      data = document.createElement("input");
      data.setAttribute("type","checkbox");
      data.setAttribute("style","top:"+top+"px;left:"+left+"px;width:"+width+"px;height:"+height+"px;");
   }
   if (type == "radio") {
      data = document.createElement("input");
      data.setAttribute("type","radio");
      data.setAttribute("style","top:"+top+"px;left:"+left+"px;width:"+width+"px;height:"+height+"px;");
   }
   if (type == "sms") {
      data = document.createElement("input");
      data.setAttribute("type","checkbox");
      data.setAttribute("x-esign-type","sms");
      data.setAttribute("style","top:"+top+"px;left:"+left+"px;");
   }
   if (type == "camera") {
      /* https://developer.mozilla.org/en-US/docs/Web/API/WebRTC_API/Taking_still_photos */
      data = document.createElement("input");
      data.setAttribute("type","file");
      data.setAttribute("accept","image/*;capture=camera");
      data.setAttribute("style","top:"+top+"px;left:"+left+"px;width:"+width+"px;height:"+height+"px;");
   }
   if (type == "file") {
      data = document.createElement("input");
      data.setAttribute("type","file");
      data.setAttribute("accept","image/*");
      data.setAttribute("style","top:"+top+"px;left:"+left+"px;");
   }
   if (type == "signature") {
      /* https://github.com/szimek/signature_pad */
      data = document.createElement("canvas");
      data.setAttribute("data-type","signature");
      data.setAttribute("style","top:"+top+"px;left:"+left+"px;width:"+width+"px;height:"+height+"px;");
   }
   if (isRequired) {
      data.setAttribute("class","esignElement esignRequired");
   } else {
      data.setAttribute("class","esignElement esignNotRequired");
   }
   data.setAttribute("onclick","esignObjMenu(this)");
   data.setAttribute("draggable","true");
   data.setAttribute("ondragstart","esignDrag(event)");
   data.setAttribute("id",id);
   data.setAttribute("name",id);
   objTarget.appendChild(data);
}

function esignRemove() {
	$("#esignElementMenu").hide();
	$(esignActive).remove();
	angular.element("#pdfPage").scope().docCtrl.updateLayout();
}

function esignObjMenu(esignOBJ) {
	esignActive = esignOBJ;
	$("#esignElementMenu").hide();
	if (window.currentDocumentAction == "edit") {
		$("#esignElementMenu").css({
			top:$(esignOBJ).offset().top + "px",
			left:$(esignOBJ).offset().left + $(esignOBJ).width() + 10 + "px"
		}).show();
	}
}

function extractFields() {
   /*
   http://www.integratingstuff.com/2014/09/14/displaying-a-part-of-a-pdf-page-and-reading-acroforms-with-pdf-js/
   http://jsfiddle.net/seikichi/RuDvz/2/
   http://stackoverflow.com/questions/19953879/links-hyperlinks-into-a-canvas-using-pdf-js
   */
   page = window.pdfPage;
   console.log("Extract PDF Fields");
   page.getAnnotations().then(
      function(items) {
         for ( var i = 0; i < items.length; i++) {
            var item = items[i];
            var w = (item.rect[2]-item.rect[0]) * window.pdfScale;
            var h = (item.rect[3]-item.rect[1]) * window.pdfScale;
            var t = window.viewport.height - (item.rect[1] * window.pdfScale) - h;
            var l = item.rect[0] * window.pdfScale;
            var fieldName = item.fullName.replace(/ /g,"_");
            switch (item.subtype) {
               case 'Widget':
                  if (item.fieldType != 'Tx' && item.fieldType != 'Btn' && item.fieldType != 'Ch') {
                     console.log('found ' + item.fieldType + ' with key ' + fieldName + ' (position: ' + item.rect + ')');
                     break;
                  }
                  if (item.fieldType == 'Tx') {
                     //console.log('found inputfield with key ' + fieldName + ' (position: ' + item.rect + ')');
                     addFormElement("text", fieldName, t, l, w, h, false, document.getElementById("eSignOverlay"))
                  }
                  if (item.fieldType == 'Btn') {
                     if (item.flags & 32768) {
                        //console.log('found radio button with key ' + fieldName + ' (position: ' + item.rect + ')');
                        addFormElement("radio", fieldName, t, l, w, h, false, document.getElementById("eSignOverlay"))
                     } else if (item.flags & 65536) {
                        //console.log('found pushbutton with key ' + fieldName + ' (position: ' + item.rect + ')');
                        addFormElement("checkbox", fieldName, t, l, w, h, false, document.getElementById("eSignOverlay"))
                     } else {
                        //console.log('found checkbox with key ' + fieldName + ' (position: ' + item.rect + ')');
                        addFormElement("checkbox", fieldName, t, l, w, h, false, document.getElementById("eSignOverlay"))
                     }
                  }
                  if (item.fieldType == 'Ch') {
                     console.log('found select box with key ' + fieldName+ ' (position: ' + item.rect + ')');
                  }
            }
         }
         /* re-run overlay to setup events */
         angular.element("#pdfPage").scope().docCtrl.updateLayout();
         angular.element("#pdfPage").scope().docCtrl.loadOverlayEvents();
      }
   );
} 
