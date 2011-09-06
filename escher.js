// var canvas_frame = document.getElementById('frame');
// context = canvas_frame.getContext('2d');

function draw_line(v1,v2,context) {
  context.moveTo(v1.x, v1.y);
  context.lineTo(v2.x, v2.y);
  context.strokeStyle = "#000";
  context.stroke();
}

function image_painter(image,context) {
  return function(frame){
    context.save();
    context.translate(frame.origin.x,
                      frame.origin.y);
    context.transform(frame.e1.x/image.width,
                      frame.e1.y/image.height,
                      frame.e2.x/image.width,
                      frame.e2.y/image.height,
                      0,
                      0);
    context.drawImage(image,0,0);
    context.restore();
  };
};

// frame -> (v -> v) : scales/translates unit vectors to frame
function frame_coord_map (frame) {
  return function(v) {
    return add_vec(frame.origin,
                   add_vec(scale_vec(frame.e1,v.x),
                           scale_vec(frame.e2,v.y)));
  };
};

// segments -> (frame -> !draws)
// a segment is a pair of vectors
// segment_list is a list of segments in the unit square.
function segment_painter (segment_list,context) {
  return function(frame) {
    for (index in segment_list) {
      draw_line(frame_coord_map(frame)(segment_list[index].start),
                frame_coord_map(frame)(segment_list[index].end),
                context);
    }
  };
}

function make_vec(x,y) {
  return {
    x: x,
    y: y
  };
}

function make_seg(v1,v2) {
  return {
    start: v1,
    end: v2
  };
}

function add_vec(v1,v2) {
  return make_vec(v1.x + v2.x,
                  v1.y + v2.y);
}

function sub_vec(v1,v2) {
  return make_vec(v1.x - v2.x,
                  v1.y - v2.y);
}

function scale_vec(v,s) {
  return make_vec(v.x * s, v.y * s);
}

var BL = make_vec(0,0);
var BR = make_vec(1,0);
var TL = make_vec(0,1);
var TR = make_vec(1,1);

var box = [make_seg(BL,BR),
           make_seg(BR,TR),
           make_seg(TR,TL),
           make_seg(TL,BL)];

// veclist -> segment_list
function path(veclist) {
  var seglist = [];
  for (var i=0; i<veclist.length-1; i++) {
    seglist.push(make_seg(veclist[i],
                          veclist[i+1]));
  }
  return seglist;
}

function transform_picture (p, origin, e1, e2) {
  return function(frame) {
    var map = frame_coord_map(frame);
    var new_origin = map(origin);
    p({origin: new_origin,
       e1: sub_vec(map(e1),new_origin),
       e2: sub_vec(map(e2),new_origin)
      });
  };
};

function flip_vert(p) {
  return transform_picture(p,
                           make_vec(0,1),
                           make_vec(1,1),
                           make_vec(0,0));
};

function flip_horiz(p) {
  return transform_picture(p,
                           make_vec(1,0),
                           make_vec(0,0),
                           make_vec(1,1));
};

function rot(p) {
  return transform_picture(p,
                           make_vec(1,0),
                           make_vec(1,1),
                           make_vec(0,0));
};

function rot180(p) {
  return rot(rot(p));
}

function rot270(p) {
  return rot(rot180(p));
}

function beside(p1,p2){
  var split = make_vec(0.5,0);
  var left = transform_picture(p1,
                               make_vec(0,0),
                               split,
                               make_vec(0,1));
  var right = transform_picture(p2,
                                split,
                                make_vec(1,0),
                                make_vec(0.5,1));
  return function(frame){
    left(frame);
    right(frame);
  };
}

function below(p1,p2){
  return rot270(beside(rot(p1),
                       rot(p2)));
}

function square_of_four(tl,tr,bl,br) {
  return function(p){
    var top = beside(tl(p),
                     tr(p));
    var bottom = beside(bl(p),
                        br(p));
    return below(bottom,top);
  };
}

function identity(p) {
  return p;
}


function right_split(p,n){
  if (n === 0) {
    return p;
  }
  var smaller = right_split(p,n-1);
  return beside(p,below(smaller,smaller));
}

function corner_split(p,n) {
  if (n === 0) { return p; };
  var up = up_split(p, n-1);
  var right = right_split(p, n-1);
  var tl = beside(up,up);
  var br = below(right,right);
  var corner = corner_split(p,n-1);
  return beside(below(p,tl),
                below(br,corner));
}

function up_split(p,n) {
  if (n === 0) {
    return p;
  }
  var smaller = right_split(p,n-1);
  return below(p,beside(smaller,smaller));
}

function square_limit(p,n) {
  var combine_four = square_of_four(flip_horiz,identity,
                                    rot180,flip_vert);
  return combine_four(corner_split(p,n));
};

test = path([make_vec(0,0.5),
             make_vec(.25,0),
             make_vec(.35,0),
             make_vec(.7,0.5)]).concat(
               path([make_vec(1,.5),
                     make_vec(0, 0.25)]));

// segment_painter(test)(frame1);

george_path = path([make_vec(0.42857143, 0.5),
                    make_vec(0.0, 0.5),
                    make_vec(0.0, 0.6),
                    make_vec(0.42857143, 0.6),
                    make_vec(0.42857143, 0.7),
                    make_vec(0.2857143, 0.8),
                    make_vec(0.2857143, 0.9),
                    make_vec(0.42857143, 1),
                    make_vec(0.5714286, 1),
                    make_vec(0.71428573, 0.9),
                    make_vec(0.71428573, 0.8),
                    make_vec(0.5714286, 0.7),
                    make_vec(0.5714286, 0.6),
                    make_vec(0.71428573, 0.6),
                    make_vec(0.71428573, 0.7),
                    make_vec(0.85714287, 0.7),
                    make_vec(0.85714287, 0.5),
                    make_vec(0.5714286, 0.5),
                    make_vec(0.5714286, 0.4),
                    make_vec(0.71428573, 0.0),
                    make_vec(0.5714286, 0.0),
                    make_vec(0.5, 0.2),
                    make_vec(0.42857143, 0.0),
                    make_vec(0.2857143, 0.0),
                    make_vec(0.42857143, 0.4),
                    make_vec(0.42857143, 0.5)]);

var p = [make_seg(make_vec(1/4,1/4),make_vec(3/8,0)),
         make_seg(make_vec(0,3/16),make_vec(3/16,1/4)),
         make_seg(make_vec(3/16,1/4),make_vec(0,1/2)),
         make_seg(make_vec(0,1/2),make_vec(0,3/16)),
         make_seg(make_vec(1/4,5/16),make_vec(7/16,3/8)),
         make_seg(make_vec(7/16,3/8),make_vec(1/4,5/8)),
         make_seg(make_vec(1/4,5/8),make_vec(1/4,5/16)),
         make_seg(make_vec(11/16,0),make_vec(5/8,1/4)),
         make_seg(make_vec(5/8,1/4),make_vec(1/2,1/2)),
         make_seg(make_vec(1/2,1/2),make_vec(1/4,13/16)),
         make_seg(make_vec(1/4,13/16),make_vec(0,1)),
         make_seg(make_vec(11/16,0),make_vec(7/8,1/8)),
         make_seg(make_vec(7/8,1/8),make_vec(1,1/8)),
         make_seg(make_vec(5/8,1/4),make_vec(13/16,5/16)),
         make_seg(make_vec(13/16,5/16),make_vec(1,1/4)),
         make_seg(make_vec(9/16,3/8),make_vec(3/4,7/16)),
         make_seg(make_vec(3/4,7/16),make_vec(1,3/8)),
         make_seg(make_vec(1/2,1/2),make_vec(3/4,9/16)),
         make_seg(make_vec(3/4,9/16),make_vec(1,1/2)),
         make_seg(make_vec(1/2,3/4),make_vec(1,5/8)),
         make_seg(make_vec(0,1),make_vec(3/8,15/16)),
         make_seg(make_vec(3/8,15/16),make_vec(1/2,1)),
         make_seg(make_vec(1/2,1),make_vec(3/4,3/4)),
         make_seg(make_vec(3/4,3/4),make_vec(1,3/4)),
         make_seg(make_vec(5/8,1),make_vec(3/4,7/8)),
         make_seg(make_vec(3/4,7/8),make_vec(1,13/16)),
         make_seg(make_vec(3/4,1),make_vec(13/16,15/16)),
         make_seg(make_vec(13/16,15/16),make_vec(1,7/8)),
         make_seg(make_vec(7/8,1),make_vec(1,15/16))];

var q = [make_seg(make_vec(1/8,0),make_vec(1/4,5/16)),
         make_seg(make_vec(1/4,5/16),make_vec(1/4,7/16)),
         make_seg(make_vec(1/4,0),make_vec(3/8,5/16)),
         make_seg(make_vec(3/8,5/16),make_vec(3/8,7/16)),
         make_seg(make_vec(3/8,0),make_vec(1/2,5/16)),
         make_seg(make_vec(1/2,5/16),make_vec(1/2,1/2)),
         make_seg(make_vec(1/2,0),make_vec(5/8,3/8)),
         make_seg(make_vec(5/8,3/8),make_vec(5/8,9/16)),
         make_seg(make_vec(5/8,0),make_vec(7/8,11/16)),
         make_seg(make_vec(3/4,0),make_vec(13/16,1/4)),
         make_seg(make_vec(13/16,1/4),make_vec(1,1/2)),
         make_seg(make_vec(1,1/2),make_vec(15/16,5/8)),
         make_seg(make_vec(15/16,5/8),make_vec(1,1)),
         make_seg(make_vec(1,1),make_vec(3/4,5/8)),
         make_seg(make_vec(3/4,5/8),make_vec(3/8,7/16)),
         make_seg(make_vec(3/8,7/16),make_vec(1/4,7/16)),
         make_seg(make_vec(1/4,7/16),make_vec(0,1/2)),
         make_seg(make_vec(13/16,0),make_vec(1,3/8)),
         make_seg(make_vec(7/8,0),make_vec(1,1/4)),
         make_seg(make_vec(15/16,0),make_vec(1,1/8)),
         make_seg(make_vec(0,5/8),make_vec(7/16,11/16)),
         make_seg(make_vec(9/16,3/4),make_vec(5/8,5/8)),
         make_seg(make_vec(5/8,5/8),make_vec(3/4,3/4)),
         make_seg(make_vec(3/4,3/4),make_vec(9/16,3/4)),
         make_seg(make_vec(1/2,15/16),make_vec(9/16,13/16)),
         make_seg(make_vec(9/16,13/16),make_vec(11/16,15/16)),
         make_seg(make_vec(11/16,15/16),make_vec(1/2,15/16)),
         make_seg(make_vec(0,3/4),make_vec(3/16,13/16)),
         make_seg(make_vec(3/16,13/16),make_vec(7/16,15/16)),
         make_seg(make_vec(7/16,15/16),make_vec(1/2,1)),
         make_seg(make_vec(1/8,1),make_vec(3/16,13/16)),
         make_seg(make_vec(1/4,1),make_vec(5/16,7/8)),
         make_seg(make_vec(3/8,1),make_vec(7/16,15/16))];

var r = [make_seg(make_vec(0,3/4),make_vec(1/16,7/8)),
         make_seg(make_vec(0,1/2),make_vec(1/8,3/4)),
         make_seg(make_vec(0,1/4),make_vec(5/16,5/8)),
         make_seg(make_vec(0,0),make_vec(1/2,1/2)),
         make_seg(make_vec(1/16,1/16),make_vec(1/4,0)),
         make_seg(make_vec(1/8,1/8),make_vec(1/2,0)),
         make_seg(make_vec(3/16,3/16),make_vec(1/2,1/8)),
         make_seg(make_vec(1/2,1/8),make_vec(3/4,0)),
         make_seg(make_vec(5/16,5/16),make_vec(3/4,3/16)),
         make_seg(make_vec(3/4,3/16),make_vec(1,0)),
         make_seg(make_vec(0,1),make_vec(1/8,3/4)),
         make_seg(make_vec(1/8,3/4),make_vec(1/2,1/2)),
         make_seg(make_vec(1/2,1/2),make_vec(7/8,3/8)),
         make_seg(make_vec(7/8,3/8),make_vec(1,1/4)),
         make_seg(make_vec(3/8,1),make_vec(11/16,5/8)),
         make_seg(make_vec(11/16,5/8),make_vec(1,3/8)),
         make_seg(make_vec(11/16,1),make_vec(3/4,3/4)),
         make_seg(make_vec(3/4,3/4),make_vec(1,1/2)),
         make_seg(make_vec(3/4,3/4),make_vec(1,1)),
         make_seg(make_vec(13/16,13/16),make_vec(1,5/8)),
         make_seg(make_vec(7/8,7/8),make_vec(1,3/4)),
         make_seg(make_vec(15/16,15/16),make_vec(1,7/8))];

var s = [make_seg(make_vec(0,0),make_vec(1/4,1/8)),
         make_seg(make_vec(1/4,1/8),make_vec(1/2,1/8)),
         make_seg(make_vec(1/2,1/8),make_vec(1,0)),
         make_seg(make_vec(0,1/4),make_vec(1/8,1/16)),
         make_seg(make_vec(0,3/8),make_vec(7/16,1/4)),
         make_seg(make_vec(0,1/2),make_vec(1/2,3/8)),
         make_seg(make_vec(0,5/8),make_vec(7/16,1/2)),
         make_seg(make_vec(0,3/4),make_vec(7/16,5/8)),
         make_seg(make_vec(0,7/8),make_vec(7/16,13/16)),
         make_seg(make_vec(1/2,1),make_vec(7/16,13/16)),
         make_seg(make_vec(7/16,13/16),make_vec(7/16,1/2)),
         make_seg(make_vec(7/16,1/2),make_vec(1/2,3/8)),
         make_seg(make_vec(1/2,3/8),make_vec(5/8,1/4)),
         make_seg(make_vec(5/8,1/4),make_vec(1,0)),
         make_seg(make_vec(5/8,1),make_vec(11/16,5/8)),
         make_seg(make_vec(5/8,3/8),make_vec(3/4,1/4)),
         make_seg(make_vec(3/4,1/4),make_vec(3/4,7/16)),
         make_seg(make_vec(3/4,7/16),make_vec(5/8,3/8)),
         make_seg(make_vec(13/16,7/16),make_vec(15/16,5/16)),
         make_seg(make_vec(15/16,5/16),make_vec(15/16,1/2)),
         make_seg(make_vec(15/16,1/2),make_vec(13/16,7/16)),
         make_seg(make_vec(3/4,1),make_vec(13/16,13/16)),
         make_seg(make_vec(13/16,13/16),make_vec(15/16,9/16)),
         make_seg(make_vec(15/16,9/16),make_vec(1,1/2)),
         make_seg(make_vec(13/16,13/16),make_vec(1,7/8)),
         make_seg(make_vec(7/8,11/16),make_vec(1,3/4)),
         make_seg(make_vec(15/16,9/16),make_vec(1,5/8))];

function quartet(p1,p2,p3,p4) {
  return below(beside(p1,p2),
               beside(p3,p4)
              );
}


var frame1 = {
  origin: make_vec(0,0),
  e1: make_vec(500,0),
  e2: make_vec(0,500)
};

var playground = document.getElementById('playground').getContext('2d');
segment_painter(box,playground)(frame1);
var george = segment_painter(george_path, playground);
