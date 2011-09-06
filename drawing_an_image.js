(function() {
   var canvas_frame = document.getElementById('drawing_an_image');
   var context = canvas_frame.getContext('2d');
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
   var image = new Image();
   image.src = 'man.gif';
   image.onload = function() {
     image_painter(image,context)(frame2);
     image_painter(image,context)(frame1);
   };
 })();