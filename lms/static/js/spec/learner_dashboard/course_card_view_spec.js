define([
        'backbone',
        'jquery',
        'js/learner_dashboard/models/course_card_model',
        'js/learner_dashboard/views/course_card_view'
    ], function (Backbone, $, CourseCardModel, CourseCardView) {
        
        'use strict';
        
        describe('Course Card View', function () {
            var view = null,
                courseCardModel,
                context = {      
                    course_modes: [],
                    display_name: 'Astrophysics: Exploring Exoplanets',
                    key: 'ANU-ASTRO1x',
                    organization: {
                        display_name: 'Australian National University',
                        key: 'ANUx'
                    },
                    run_modes: [{
                        start_date: 'Apr 25, 2016',
                        end_date: 'Jun 13, 2019',
                        course_key: 'course-v1:ANUx+ANU-ASTRO1x+3T2015',
                        course_url: 'http://localhost:8000/courses/course-v1:edX+DemoX+Demo_Course/info',
                        marketing_url: 'https://www.edx.org/course/astrophysics-exploring',
                        course_image_url: 'http://test.com/image1',
                        mode_slug: 'verified',
                        run_key: '2T2016',
                        course_started: true,
                        is_enrolled: true,
                        course_ended: false,
                        is_enrollment_open: true,
                        certificate_url: '',
                        enrollment_open_date: 'Mar 03, 2016'
                    }]
                },

            setupView = function(data, isEnrolled){
                data.run_modes[0].is_enrolled = isEnrolled;
                setFixtures('<div class="course-card card"></div>');
                courseCardModel = new CourseCardModel(data);
                view = new CourseCardView({
                    model: courseCardModel
                });
            },

            validateCourseInfoDisplay = function(){
                //DRY validation for course card in enrolled state
                expect(view.$('.header-img').attr('src')).toEqual(context.run_modes[0].course_image_url);
                expect(view.$('.course-details .course-title-link').text().trim()).toEqual(context.display_name);
                expect(view.$('.course-details .course-title-link').attr('href')).toEqual(
                    context.run_modes[0].course_url);
                expect(view.$('.course-details .course-text .course-key').html()).toEqual(context.key);
                expect(view.$('.course-details .course-text .run-period').html())
                    .toEqual(context.run_modes[0].start_date + ' - ' + context.run_modes[0].end_date);
            };

            beforeEach(function() {
                setupView(context, false);
            });

            afterEach(function() {
                view.remove();
            });

            it('should exist', function() {
                expect(view).toBeDefined();
            });

            it('should render the course card based on the data enrolled', function() {
                view.remove();
                setupView(context, true);
                validateCourseInfoDisplay();
            });

            it('should render the course card based on the data not enrolled', function() {
                validateCourseInfoDisplay();
            });

            it('should update render if the course card is_enrolled updated', function() {
                courseCardModel.set({
                    is_enrolled: true
                });
                validateCourseInfoDisplay();
            });

            it('should only show certificate status section if a certificate has been earned', function() {
                var data = context,
                    certUrl = 'sample-certificate';

                setupView(context, false);
                expect(view.$('certificate-status').length).toEqual(0);
                view.remove();
                data.run_modes[0].certificate_url = certUrl;
                setupView(data, false);
                expect(view.$('.certificate-status').length).toEqual(1);
                expect(view.$('.certificate-status .cta-secondary').attr('href')).toEqual(certUrl);
            });

            it('should render the course card with coming soon', function(){
                view.remove();
                context.run_modes[0].is_enrollment_open = false;
                setupView(context, false);
                expect(view.$('.header-img').attr('src')).toEqual(context.run_modes[0].course_image_url);
                expect(view.$('.course-details .course-title').text().trim()).toEqual(context.display_name);
                expect(view.$('.course-details .course-title-link').length).toBe(0);
                expect(view.$('.course-details .course-text .course-key').html()).toEqual(context.key);
                expect(view.$('.course-details .course-text .run-period').length).toBe(0);
                expect(view.$('.no-action-message').text().trim()).toBe('Coming Soon');
                expect(view.$('.enroll-open-date').text().trim())
                    .toBe(context.run_modes[0].enrollment_open_date);
            });
        });
    }
);
