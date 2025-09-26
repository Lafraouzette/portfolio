(function ($) {
    "use strict";
    
    // loader
    var loader = function () {
        setTimeout(function () {
            if ($('#loader').length > 0) {
                $('#loader').removeClass('show');
            }
        }, 1);
    };
    loader();
    
    
    // Initiate the wowjs
    new WOW().init();
    
    
    // Back to top button
    $(window).scroll(function () {
        if ($(this).scrollTop() > 200) {
            $('.back-to-top').fadeIn('slow');
        } else {
            $('.back-to-top').fadeOut('slow');
        }
    });
    $('.back-to-top').click(function () {
        $('html, body').animate({scrollTop: 0}, 1500, 'easeInOutExpo');
        return false;
    });
    
    
    // Sticky Navbar
    $(window).scroll(function () {
        if ($(this).scrollTop() > 0) {
            $('.navbar').addClass('nav-sticky');
        } else {
            $('.navbar').removeClass('nav-sticky');
        }
    });
    
    
    // Smooth scrolling on the navbar links
    $(".navbar-nav a").on('click', function (event) {
        if (this.hash !== "") {
            event.preventDefault();
            
            $('html, body').animate({
                scrollTop: $(this.hash).offset().top - 45
            }, 1500, 'easeInOutExpo');
            
            if ($(this).parents('.navbar-nav').length) {
                $('.navbar-nav .active').removeClass('active');
                $(this).closest('a').addClass('active');
            }
        }
    });
    
    
    // Typed Initiate
    if ($('.hero .hero-text h2').length == 1) {
        var typed_strings = $('.hero .hero-text .typed-text').text();
        var typed = new Typed('.hero .hero-text h2', {
            strings: typed_strings.split(', '),
            typeSpeed: 100,
            backSpeed: 20,
            smartBackspace: false,
            loop: true
        });
    }
    
    
    // Skills
    $('.skills').waypoint(function () {
        $('.progress .progress-bar').each(function () {
            $(this).css("width", $(this).attr("aria-valuenow") + '%');
        });
    }, {offset: '80%'});


    // Testimonials carousel
    $(".testimonials-carousel").owlCarousel({
        center: true,
        autoplay: true,
        dots: true,
        loop: true,
        responsive: {
            0:{
                items:1
            }
        }
    });
    
    
    
    // Portfolio filter
    var portfolioIsotope = $('.portfolio-container').isotope({
        itemSelector: '.portfolio-item',
        layoutMode: 'fitRows'
    });

    // Store active tech filters
    var activeTechFilters = [];
    var currentCategoryFilter = '*';

    // Category filter (Tous, Stages, etc.)
    $('#portfolio-filter li[data-filter]').on('click', function () {
        $("#portfolio-filter li[data-filter]").removeClass('filter-active');
        $(this).addClass('filter-active');
        currentCategoryFilter = $(this).data('filter');
        applyFilters();
    });

    // Technology badge filter selection
    $('.tech-badge-filter').on('click', function (e) {
        e.preventDefault();
        var tech = $(this).data('filter-tech');
        
        if ($(this).hasClass('active')) {
            // Remove filter
            $(this).removeClass('active');
            activeTechFilters = activeTechFilters.filter(function(item) {
                return item !== tech;
            });
        } else {
            // Add filter
            $(this).addClass('active');
            if (activeTechFilters.indexOf(tech) === -1) {
                activeTechFilters.push(tech);
            }
        }
        
        applyFilters();
    });

    // Clear all tech filters
    $('#clearTechFiltersBtn').on('click', function () {
        activeTechFilters = [];
        
        // Reset tech filters
        $('.tech-badge-filter').removeClass('active');
        
        applyFilters();
    });

    // Apply filters function
    function applyFilters() {
        var filterString = currentCategoryFilter;
        
        if (activeTechFilters.length > 0) {
            // Create tech filter selector
            var techSelector = activeTechFilters.map(function(tech) {
                return '[data-tech*="' + tech + '"]';
            }).join('');
            
            if (currentCategoryFilter === '*') {
                filterString = techSelector;
            } else {
                filterString = currentCategoryFilter + techSelector;
            }
        }
        
        portfolioIsotope.isotope({filter: filterString});
    }


    // Initialize with default filter
    applyFilters();

    // Formations functionality
    var selectedFormation = '';

    // Formation button click handler
    $('.formation-btn').on('click', function() {
        selectedFormation = $(this).data('formation');
        $('#selectedFormation').text(selectedFormation);
        $('#formationModal').modal('show');
    });

    // Form validation and submission
    $('#formationForm').on('submit', function(e) {
        e.preventDefault();
        
        var form = this;
        var formData = new FormData(form);
        formData.append('formation', selectedFormation);
        
        // Validate form
        if (validateForm()) {
            // Show loading state
            var submitBtn = $(form).find('button[type="submit"]');
            var originalText = submitBtn.html();
            submitBtn.html('<i class="fas fa-spinner fa-spin"></i> Envoi en cours...').prop('disabled', true);
            
            // Send email
            sendFormationEmail(formData)
                .then(function(response) {
                    // Success
                    $('#formationModal').modal('hide');
                    $('#successModal').modal('show');
                    form.reset();
                })
                .catch(function(error) {
                    // Error
                    showFormError('Erreur lors de l\'envoi. Veuillez réessayer.');
                })
                .finally(function() {
                    // Reset button
                    submitBtn.html(originalText).prop('disabled', false);
                });
        }
    });

    // Form validation function
    function validateForm() {
        var isValid = true;
        var form = document.getElementById('formationForm');
        
        // Clear previous errors
        $(form).find('.is-invalid').removeClass('is-invalid');
        $(form).find('.invalid-feedback').text('');
        
        // Validate required fields
        var requiredFields = ['fullName', 'email', 'phone', 'terms'];
        
        requiredFields.forEach(function(fieldName) {
            var field = form[fieldName];
            var feedback = $(field).siblings('.invalid-feedback');
            
            if (fieldName === 'terms') {
                if (!field.checked) {
                    $(field).addClass('is-invalid');
                    feedback.text('Vous devez accepter les conditions d\'inscription.');
                    isValid = false;
                }
            } else {
                if (!field.value.trim()) {
                    $(field).addClass('is-invalid');
                    feedback.text('Ce champ est obligatoire.');
                    isValid = false;
                } else if (fieldName === 'email' && !isValidEmail(field.value)) {
                    $(field).addClass('is-invalid');
                    feedback.text('Veuillez entrer une adresse email valide.');
                    isValid = false;
                } else if (fieldName === 'phone' && !isValidPhone(field.value)) {
                    $(field).addClass('is-invalid');
                    feedback.text('Veuillez entrer un numéro de téléphone valide.');
                    isValid = false;
                }
            }
        });
        
        return isValid;
    }

    // Email validation
    function isValidEmail(email) {
        var emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    // Phone validation
    function isValidPhone(phone) {
        var phoneRegex = /^[\+]?[0-9\s\-\(\)]{10,}$/;
        return phoneRegex.test(phone);
    }

    // Send formation email
    function sendFormationEmail(formData) {
        return new Promise(function(resolve, reject) {
            // Using EmailJS for email sending
            if (typeof emailjs !== 'undefined') {
                var templateParams = {
                    to_name: 'Formation Team',
                    from_name: formData.get('fullName'),
                    from_email: formData.get('email'),
                    phone: formData.get('phone'),
                    formation: formData.get('formation'),
                    experience: formData.get('experience') || 'Non spécifié',
                    message: formData.get('message') || 'Aucun message',
                    reply_to: formData.get('email')
                };

                emailjs.send('YOUR_SERVICE_ID', 'YOUR_TEMPLATE_ID', templateParams)
                    .then(function(response) {
                        console.log('Email sent successfully:', response);
                        resolve(response);
                    })
                    .catch(function(error) {
                        console.error('Email sending failed:', error);
                        reject(error);
                    });
            } else {
                // Fallback: Use a simple fetch request to a PHP script
                fetch('mail/formation.php', {
                    method: 'POST',
                    body: formData
                })
                .then(function(response) {
                    if (response.ok) {
                        resolve(response);
                    } else {
                        reject(new Error('Server error'));
                    }
                })
                .catch(function(error) {
                    reject(error);
                });
            }
        });
    }

    // Show form error
    function showFormError(message) {
        // Create a simple alert or toast notification
        alert(message);
    }

    // Real-time form validation
    $('#formationForm input, #formationForm select, #formationForm textarea').on('blur', function() {
        var field = this;
        var feedback = $(field).siblings('.invalid-feedback');
        
        if (field.hasAttribute('required') && !field.value.trim()) {
            $(field).addClass('is-invalid');
            feedback.text('Ce champ est obligatoire.');
        } else if (field.type === 'email' && field.value && !isValidEmail(field.value)) {
            $(field).addClass('is-invalid');
            feedback.text('Veuillez entrer une adresse email valide.');
        } else if (field.type === 'tel' && field.value && !isValidPhone(field.value)) {
            $(field).addClass('is-invalid');
            feedback.text('Veuillez entrer un numéro de téléphone valide.');
        } else {
            $(field).removeClass('is-invalid');
            feedback.text('');
        }
    });

    // Clear form when modal is hidden
    $('#formationModal').on('hidden.bs.modal', function() {
        var form = document.getElementById('formationForm');
        form.reset();
        $(form).find('.is-invalid').removeClass('is-invalid');
        $(form).find('.invalid-feedback').text('');
    });
    
})(jQuery);

