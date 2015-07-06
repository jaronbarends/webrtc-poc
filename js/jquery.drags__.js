// http://css-tricks.com/snippets/jquery/draggable-without-jquery-ui

;(function($) {

    'use strict';

    $.fn.drags = function(opt) {

        //define semi-globals: global within this main function's scope
        // prefix them with sg to distinguish them from normal vars
        opt = $.extend({handle:"",cursor:"move"}, opt);

        if(opt.handle === "") {
            var $el = this;
        } else {
            var $el = this.find(opt.handle);
        }


        /**
        * 
        * @param {event} e Mousemove event triggering this function
        * @param {object} cdr Object containing info of current drag
        * @returns {undefined}
        */
        var mousemoveHandler = function(e, cdr) {

            /*-- Start added jaron: keep track of latest x and y pos relative to parent --*/
                var last_rel_x,
                    last_rel_y;
            /*-- End added jaron: keep track of latest x and y pos relative to parent --*/

            var top = e.pageY + cdr.posY - cdr.drgH,
                left = e.pageX + cdr.posX - cdr.drgW;
                
            $('.draggable').offset({
                top: top,
                left: left
            }).on("mouseup", function() {
                $(this).removeClass('draggable').css('z-index', cdr.zIdx);
            });

            /*-- Start added jaron: send move event with relative positions when position has changed --*/
                var rel_x = left - cdr.parent_x,
                    rel_y = top - cdr.parent_y;

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
        };
        


        /**
        * 
        * @param {string} varname Description
        * @returns {undefined}
        */
        var mousedownHandler = function(e) {
            
            e.preventDefault(); // disable selection

            if(opt.handle === "") {
                var $drag = $(this).addClass('draggable');
            } else {
                var $drag = $(this).addClass('active-handle').parent().addClass('draggable');
            }

            //define object with current drag's info
            var cdr = {};
            cdr.$parent = $drag.parent(),
            cdr.parent_y = cdr.$parent.offset().top,
            cdr.parent_x = cdr.$parent.offset().left,
            cdr.zIdx = $drag.css('z-index'),
            cdr.drgH = $drag.outerHeight(),
            cdr.drgW = $drag.outerWidth(),
            cdr.posY = $drag.offset().top + cdr.drgH - e.pageY,
            cdr.posX = $drag.offset().left + cdr.drgW - e.pageX;

            $drag.css('z-index', 1000)
                .parents()
                .on("mousemove", function() {
                    console.log('mv');
                    mousemoveHandler(e, cdr);
                });
        };


        /**
        * 
        * @param {string} varname Description
        * @returns {undefined}
        */
        var mouseupHandler = function(e) {
            if(opt.handle === "") {
                $(this).removeClass('draggable');
            } else {
                $(this).removeClass('active-handle').parent().removeClass('draggable');
            }
            $(this).parents().off("mousemove");//added jaron: stop watching parent on mouseup
        };
        
        

        $el.css('cursor', opt.cursor)
            .on("mousedown", mousedownHandler )
            .on("mouseup", mouseupHandler);

        return $el;

    }
})(jQuery);