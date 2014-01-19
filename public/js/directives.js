'use strict';
angular.module( 'app.directives', [] )

   .directive( 'pipitlist', [ function () {
      return {
         restrict: 'E',
         template: "<div class='panel' ng-style='getStyleObj(item)'>{{item.title}}</div>",
         link: function ( scope, element, attribs ) {
            scope.getStyleObj = function ( item ) {
               return { cursor: 'pointer'  }
            }
         }
      }
   }] )

   .directive( 'map', [ "ElementMap", function ( ElementMap ) {
      return  {
         restrict: 'A',
         link: function ( scope, element, attribs ) {
            ElementMap.add( element[0] ).with( attribs.map );
         }
      }
   }] )


   .directive( 'slider', function ( $document, $swipe, WindowService ) {
      return {
         restrict: "E",
         require: '?ngModel',
         link: function ( scope, element, attr, ngModel ) {
            var startX = 0,
               width = WindowService.width,
               height = WindowService.height,
               x = 0,
               sliderWidth = element.prop( "offsetWidth" );

            WindowService.signal.add( function ( w, h ) {
               width = w;
               height = h;
               var n = attr.value / attr.max;
               x = (width - sliderWidth) * n;
               element.css( {
                  left: x + 'px'
               } );
            } );


            if (WindowService.hasTouch) {
               $swipe.bind( element, {start: start, move: move} );
            }

            else {
               element.on( 'mousedown', function ( event ) {

                  event.preventDefault();
                  startX = event.screenX - x;

                  $document.on( 'mousemove', mouseMove );
                  $document.on( 'mouseup', mouseEnd );

               } );
            }


            function start( pos ) {
               startX = pos.x - x;
            }

            function mouseMove( event ) {
               move( {x: event.screenX, y: event.screenY} );
            }

            function move( pos ) {
               var n = x / (width - sliderWidth);
               var v = (Math.floor( (attr.max - 1) * n ) + 1);
               if (attr.value != v) {
                  attr.value = v;
                  scope.$apply( function () {
                     ngModel.$setViewValue( attr.value );
                  } );
               }

               x = pos.x - startX;
               x = Math.max( 0, x );
               x = Math.min( x, width - sliderWidth );
               element.css( {
                  left: x + 'px'
               } );
            }


            function mouseEnd() {
               $document.unbind( 'mousemove', mouseMove );
               $document.unbind( 'mouseup', mouseEnd );
            }
         }
      }
   } )

   .directive( 'marker', function ( WindowService ) {
      return {
         restrict: "E",
         require: '?ngModel',
         link: function ( scope, element, attr, ngModel ) {
            var width = WindowService.width, x = 0,
               sliderWidth = element.prop( "offsetWidth" );

            // Specify how UI should be updated
            ngModel.$render = function () {

               repos();

            };

            WindowService.signal.add( function ( w, h ) {
               width = w;
               repos();
            } );

            function repos(){
               var n = ngModel.$viewValue / attr.max;
               x = (width - sliderWidth) * n;
               element.css( {
                  left: x + 'px'
               } );
            }


         }
      }
   } );





