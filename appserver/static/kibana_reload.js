 (function() {
   require([
     "underscore",
     "jquery",
     "splunkjs/mvc",
     "splunkjs/ready!",
     "splunkjs/mvc/simplexml/ready!",
   ], function(_, $, mvc) {
 
     function reloadPageWithNewTime(earliest, latest) {
       var k = location.href;
       var s = location.search.substring(1);
       var i = (s.length < 1 ? k.length : k.indexOf(location.search))
     
       var x = s?JSON.parse('{"' + s.replace(/&/g, '","').replace(/=/g,'":"') + '"}',
         function(key, value) { return key===""?value:decodeURIComponent(value) }):{}
 
       if (typeof earliest !== "undefined") {
         x.earliest = earliest;  
       }
       if (typeof latest !== "undefined") {
         x.latest = latest;  
       } 
       
       newSearch = Object.keys(x).map(function(k) {
         return encodeURIComponent(k) + '=' + encodeURIComponent(x[k])
       }).join('&')
 
       newUrl=k.substring(0, i) + "?" + newSearch;
 
       window.location = newUrl;
     };
 
     function setPanZoomTimer() {
       if (!pan_zoom_timer_is_on) {
         myVar = setTimeout(checkPanZoomBoundaries, 100);
         pan_zoom_timer_is_on = 1;
       }
     }
 
     function checkPanZoomBoundaries() {
       var defaultTokenModel   = mvc.Components.get('default');
 
       if (pan_zoom_timer_is_on) {
         pan_zoom_timer_is_on = 0;
       }
 
       var ts_earliest = defaultTokenModel.get("kibana_pan_zoom.earliest");
       var ts_latest = defaultTokenModel.get("kibana_pan_zoom.latest");
       
       if ($('[class*="btn-reset"]').length || $('button').find('[class^="resetZoom"]').length && ts_earliest > 0 && ts_latest > 0) {
         reloadPageWithNewTime(ts_earliest, ts_latest);
       }
     }
 
   
     /////////////////////////////////////////
     ///  Start Main Code Here
     /////////////////////////////////////////
     
     var defaultTokenModel   = mvc.Components.get('default');
     var pan_zoom_timer_is_on = 0;
 
     defaultTokenModel.on("change:kibana_pan_zoom.earliest", function(model, value, options) {
       setPanZoomTimer();
     });
     defaultTokenModel.on("change:kibana_pan_zoom.latest", function(model, value, options) {
       setPanZoomTimer();
     });
   });
 }).call(this);
