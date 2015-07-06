// thanks once again to chris coyer for this wonderful snippet
// edited to support touch events
// www.riccardolardi.ch
// http://css-tricks.com/snippets/jquery/draggable-without-jquery-ui
 
(function($) {
 
    $.fn.drags = function(opt) {
 
        opt = $.extend({
            handle:"",
            cursor:"move"
        }, opt);
 
        if(opt.handle === "") {
            var $el = this;
        } else {
            var $el = this.find(opt.handle);
        }
 
        return $el.css('cursor', opt.cursor).on("mousedown touchstart", function(e) {

            /*-- Start added jaron: keep track of latest x and y pos relative to parent --*/
                var last_rel_x,
                    last_rel_y;
            /*-- End added jaron: keep track of latest x and y pos relative to parent --*/
 
            if(opt.handle === "") {
                var $drag = $(this).addClass('draggable');
            } else {
                var $drag = $(this).addClass('active-handle').parent().addClass('draggable');
            }
 
            var z_idx = $drag.css('z-index'),
                drg_h = $drag.outerHeight(),
                drg_w = $drag.outerWidth(),
                pos_y = $drag.offset().top + drg_h - e.pageY || $drag.offset().top + drg_h - e.originalEvent.pageY,
                pos_x = $drag.offset().left + drg_w - e.pageX || $drag.offset().left + drg_w - e.originalEvent.pageX,
                $parent = $drag.parent(),
                parent_y = $parent.offset().top,
                parent_x = $parent.offset().left;
 
            $drag.css('z-index', z_idx)
                .parents()
                .on("mousemove touchmove", function(e) {

                    var top = e.pageY  + pos_y - drg_h || e.originalEvent.pageY + pos_y - drg_h,
                        left = e.pageX + pos_x - drg_w || e.originalEvent.pageX + pos_x - drg_w;
 
                    $('.draggable').offset({
                        top: top,
                        left: left
                    });

                /*-- Start added jaron: send move event with relative positions when position has changed --*/
                    var rel_x = left - parent_x,
                        rel_y = top - parent_y;

                    if (rel_x !== last_rel_x || rel_y !== last_rel_y) {
                        last_rel_x = rel_x;
                        last_rel_y = rel_y;
                        var evtData = {
                            top: rel_y,
                            left: rel_x,
                            targetElm: e.target
                        };
                        $(document).trigger('move.drags', evtData);
                    }
                /*-- End added jaron: send move event with relative positions when position has changed --*/
 
            });
 
            e.preventDefault();
 
        }).on("mouseup touchend touchcancel", function() {

            if(opt.handle === "") {
                $(this).removeClass('draggable');
            } else {
                $(this).removeClass('active-handle')
                    .parent()
                    .removeClass('draggable');
            }
            $(this).parents().off("mousemove touchmove");//added jaron: stop watching parent on mouseup
 
        });
 
    }
   
})(jQuery);