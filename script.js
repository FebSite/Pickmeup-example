(function($, Drupal) {
  Drupal.behaviors.dateCalculator = {
    attach: function (context, settings) {
      if (context !== document) {
        return;
      };

      jQuery.fn.extend({
        resetNextDates: function() {
          var $thisParentFormItem = $(this).closest('.js-form-item');
          var $nextFormItem =  $thisParentFormItem.next('.js-form-item');
          var $nextAllFormItems =  $thisParentFormItem.nextAll('.js-form-item');
          // Add class is-focus for current item
          $thisParentFormItem.addClass('is-focus');

          // reset Next All Dates
          $nextAllFormItems.removeClass('is-focus');
          $nextAllFormItems.each(function() {
            var $dateField = $(this).find('.form-text');
            // Reset value
            $dateField.val('');
            $(this).addClass('disabled');
          });
          // Enable Next Date
          $nextFormItem.removeClass('disabled');
        },
      });

      Date.prototype.addDays = function(days) {
        var date = new Date(this.valueOf());
        date.setDate(date.getDate() + days);
        return date;
      }

      Date.prototype.removeDays = function(days) {
        var date = new Date(this.valueOf());
        date.setDate(date.getDate() - days);
        return date;
      }
      
      var $bargainingDate = $('.js-bargaining-date');
      var $nerrDate = $('.js-nerr-date');
      var $votingDate = $('.js-voting-date');
      var $accessDate = $('.js-access-date');
      var $votingEndDate = $('.js-voting-end-date');
      var $lodgeDate = $('.js-lodge-date');
      var maxNerrDate = new Date;
      var minvotingDate = new Date;
      var minAccessDate = new Date;
      var minVotingEndDate = new Date;
      var maxLodgeDate = new Date;

      $nerrDate.find('input').each(function() {
        pickmeup(this, {
          default_date : false,
          title_format: 'B Y',
          format: 'd B Y',
          hide_on_select: true,
          date: maxNerrDate,
          render : function (date) {
            if (date > maxNerrDate) {
              return {disabled : true, class_name : 'invalid-date'};
            }
            return {};
          } 
        });
      });

      $votingDate.find('input').each(function() {
        pickmeup(this, {
          default_date : false,
          title_format: 'B Y',
          format: 'd B Y',
          hide_on_select: true,
          date: minvotingDate,
          render : function (date) {
            if (date < minvotingDate) {
              return {disabled : true, class_name : 'invalid-date'};
            }
            return {};
          } 
        });
      });

      $accessDate.find('input').each(function() {
        pickmeup(this, {
          default_date : false,
          title_format: 'B Y',
          format: 'd B Y',
          hide_on_select: true,
          date: minAccessDate,
          render : function (date) {
            if (date < minAccessDate) {
              return {disabled : true, class_name : 'invalid-date'};
            }
            return {};
          } 
        });
      });
  
      $votingEndDate.find('input').each(function() {
        pickmeup(this, {
          default_date : false,
          title_format: 'B Y',
          format: 'd B Y',
          hide_on_select: true,
          date: minVotingEndDate,
          render : function (date) {
            if (date < minVotingEndDate) {
              return {disabled : true, class_name : 'invalid-date'};
            }
            return {};
          } 
        });
      });
      
      $lodgeDate.find('input').each(function() {
        pickmeup(this, {
          default_date : false,
          title_format: 'B Y',
          format: 'd B Y',
          hide_on_select: true,
          date: maxLodgeDate,
          render : function (date) {
            if (date > maxLodgeDate) {
              return {disabled : true, class_name : 'invalid-date'};
            }
            return {};
          } 
        });
      });

      $bargainingDate.find('input').each(function() {
        pickmeup(this, {
          default_date : false,
          title_format: 'B Y',
          format: 'd B Y',
          hide_on_select: true
        });

        this.addEventListener('pickmeup-change', function (e) {
          var bargainingDate = e.detail.date;
          maxNerrDate = bargainingDate.addDays(14);
          $(this).resetNextDates();

          $nerrDate.find('input').each(function() {
            pickmeup(this).update();
            pickmeup(this).hide();

            this.addEventListener('pickmeup-change', function (e) {
              var nerrDate = e.detail.date;
              minvotingDate = nerrDate.addDays(21);
              $(this).resetNextDates();

              $votingDate.find('input').each(function() {
                pickmeup(this).update();
                pickmeup(this).hide();

                this.addEventListener('pickmeup-change', function (e) {
                  var votingDate = e.detail.date;
                  minAccessDate = votingDate.removeDays(7);
                  $(this).resetNextDates();

                  $accessDate.find('input').each(function() {
                    pickmeup(this).update();
                    pickmeup(this).hide();

                    this.addEventListener('pickmeup-change', function (e) {
                      minVotingEndDate = votingDate.addDays(7);
                      $(this).resetNextDates();
  
                      $votingEndDate.find('input').each(function() {
                        pickmeup(this).update();
                        pickmeup(this).hide();
  
                        this.addEventListener('pickmeup-change', function (e) {
                          var votingEndDate = e.detail.date;
                          maxLodgeDate = votingEndDate.addDays(14);
                          $(this).closest('.js-form-item').addClass('is-focus');
                          $lodgeDate.removeClass('disabled');
      
                          $lodgeDate.find('input').each(function() {
                            pickmeup(this).update();
                            pickmeup(this).hide();

                            this.addEventListener('pickmeup-change', function (e) {
                              $(this).closest('.js-form-item').addClass('is-focus');
                            });
                          });
                        })
                      });
                    })
                  });
                })
              });
            })
          });
        })
      });
    },
  };
})(jQuery, Drupal);
