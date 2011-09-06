// combining_pictures.js
(function() {
   var canvas_frame = document.getElementById('combining_pictures');
   var context = canvas_frame.getContext('2d');
   var george = segment_painter(george_path,context);
   display = square_of_four(flip_horiz,identity,
                            rot,flip_vert);
   beside(right_split(george,3),
          display(george))(frame1);
 })();
