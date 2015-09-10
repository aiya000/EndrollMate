$.fn.tvCredits = function (options) {
    return this.each(function () {

        var defaults = {
            direction: 'up',
            complete : function () {
            },
            speed    : 25000,
            height   : 350
        }

        var settings = $.extend(defaults, options)
            , element = $(this)
            , list = element.find("ul")
            , children = list.children()
            , speed = settings.speed
            , loop = 0
            , animation;

        var start = function (loop, containerWidth) {

            if (settings.direction == 'left') {

                // reset margins
                list.css('margin-top', 0);
                list.css('margin-bottom', 0);

                if (loop == 0) {

                    // change elements to be displayed inline
                    element.css('display', 'block');
                    list.css('display', 'inline-block');
                    children.css('display', 'inline');

                    // recalculate element width
                    containerWidth = 0;
                    children.each(function () {
                        containerWidth += $(this).innerWidth();
                    });
                    containerWidth += containerWidth;
                    var currentWidth = list.innerWidth();
                    if (currentWidth < containerWidth) {
                        list.css('width', containerWidth + 'px');
                    }
                }

                // reset margin-left
                list.css("margin-left", '100%');

                animation = {"margin-left": '-' + containerWidth + 'px' }

                loop++;

            } else {

                var elementHeight = settings.height;
                element.css('height', settings.height + 'px');

                list.css('margin-top', elementHeight - (elementHeight * 0.2) +'px');
                list.css('margin-bottom', '-' + elementHeight + 'px');

                if (loop == 0) {
                    // reset display
                    element.css('display', 'table');
                    list.css('display', 'block');
                    children.css('display', 'block');

                    list.css('margin-left', 0);
                    list.css('width', '90%');
                }

                // recalculate element height
                var containerHeight = 0;
                children.each(function () {
                    containerHeight += $(this).height();
                });

                list.css('height', elementHeight);

                animation = {"margin-top": '-' + (containerHeight * 2) + 'px'};

                loop++;
            }

            list.animate(animation, speed, 'linear', function () {
                settings.complete();
                start(loop, containerWidth);
            });
        }

        start(loop, null);

    });
}