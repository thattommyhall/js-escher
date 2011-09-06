(function() {
   var canvas_frame = document.getElementById('drawing_him');
   var context = canvas_frame.getContext('2d');
   var george = segment_painter(george_path,context);
   var frame1 = {
     origin: make_vec(100,50),
     e1: make_vec(300,100),
     e2: make_vec(150,200)
   };
   var frame2 = {
     origin: make_vec(0,50),
     e1: make_vec(100,0),
     e2: make_vec(0,200)
   };

   george(frame2);
   george(frame1);
   segment_painter(box,context)(frame1);
   segment_painter(box,context)(frame2);
 })();