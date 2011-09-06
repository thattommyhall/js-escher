(function() {
   var canvas_frame = document.getElementById('square_limit');
   var context = canvas_frame.getContext('2d');

   function square_limit(p,n) {
     var combine_four = square_of_four(flip_horiz,identity,
                                       rot180,flip_vert);
     return combine_four(corner_split(p,n));
   };

   var p_painter = segment_painter(p,context);
   var q_painter = segment_painter(q,context);
   var r_painter = segment_painter(r,context);
   var s_painter = segment_painter(s,context);

   var t = quartet(p_painter,q_painter,r_painter,s_painter);

   square_limit(t,1)(frame1);
})();




