(function() {
   var canvas_frame = document.getElementById('eschers_angels');
   var context = canvas_frame.getContext('2d');
   var image = new Image();
   image.src = 'angels.jpg';
   image.onload = function() {
     var angels = image_painter(image,context);
     var two = below(angels,angels);
     var four = below(two, two);
     var part = flip_horiz(right_split(four,3));
     beside(part,flip_horiz(part))(frame1);
   };
 })();