(function() {
   var canvas_frame = document.getElementById('tile_t');
   var context = canvas_frame.getContext('2d');

   var p_painter = segment_painter(p,context);
   var q_painter = segment_painter(q,context);
   var r_painter = segment_painter(r,context);
   var s_painter = segment_painter(s,context);

   var t = quartet(p_painter,q_painter,r_painter,s_painter);

   t(frame1);
})();




