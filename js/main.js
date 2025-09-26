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
        console.log('🎯 Formation sélectionnée:', selectedFormation);
        console.log('📋 Bouton cliqué:', $(this).text().trim());
        console.log('📊 Données du bouton:', $(this).data());
        
        $('#selectedFormation').text(selectedFormation);
        $('#formationModal').modal('show');
        
        console.log('📱 Modal d\'inscription ouvert pour:', selectedFormation);
    });

    // Form validation and submission - Attendre que le DOM soit prêt
    $(document).ready(function() {
        console.log('🔧 Attachement de l\'événement submit au formulaire');
        console.log('🔍 Formulaire trouvé:', $('#formationForm').length);
        
        if ($('#formationForm').length === 0) {
            console.error('❌ Formulaire non trouvé ! Vérifiez l\'ID du formulaire.');
            return;
        }
        
        $('#formationForm').on('submit', function(e) {
        console.log('🚀 Événement submit détecté');
        e.preventDefault();
        e.stopPropagation();
        
        console.log('🚀 Début de la soumission du formulaire de formation');
        
        var form = this;
        var formData = new FormData(form);
        formData.append('formation', selectedFormation);
        
        // Log des données du formulaire
        console.log('📋 Données du formulaire:');
        for (var pair of formData.entries()) {
            console.log('  - ' + pair[0] + ': ' + pair[1]);
        }
        console.log('📧 Formation sélectionnée:', selectedFormation);
        console.log('📅 Timestamp:', new Date().toLocaleString('fr-FR'));
        
        // Validate form
        if (validateForm()) {
            console.log('✅ Validation du formulaire réussie');
            
            // Show loading state
            var submitBtn = $(form).find('button[type="submit"]');
            var originalText = submitBtn.html();
            submitBtn.html('<i class="fas fa-spinner fa-spin"></i> Envoi en cours...').prop('disabled', true);
            
            console.log('⏳ Envoi de l\'email en cours...');
            
            // Send email
            sendFormationEmail(formData)
                .then(function(response) {
                    // Success
                    console.log('✅ Email envoyé avec succès!');
                    console.log('📬 Réponse du serveur:', response);
                    console.log('📧 Email de notification envoyé à l\'administrateur');
                    console.log('📨 Email de confirmation envoyé à l\'utilisateur');
                    console.log('🎯 Formation:', selectedFormation);
                    console.log('👤 Utilisateur:', formData.get('fullName'), '(' + formData.get('email') + ')');
                    console.log('📱 Téléphone:', formData.get('phone'));
                    console.log('🎓 Niveau:', formData.get('experience') || 'Non spécifié');
                    console.log('💬 Message:', formData.get('message') || 'Aucun message');
                    console.log('📅 Date d\'envoi:', new Date().toLocaleString('fr-FR'));
                    
                    $('#formationModal').modal('hide');
                    $('#successModal').modal('show');
                    form.reset();
                    
                    console.log('🎉 Processus d\'inscription terminé avec succès');
                })
                .catch(function(error) {
                    // Error
                    console.error('❌ Erreur lors de l\'envoi de l\'email:');
                    console.error('🔍 Détails de l\'erreur:', error);
                    console.error('📊 Informations de debug:', {
                        message: error.message || 'Erreur inconnue',
                        status: error.status || 'N/A',
                        timestamp: new Date().toISOString(),
                        formation: selectedFormation,
                        userEmail: formData.get('email')
                    });
                    
                    showFormError('Erreur lors de l\'envoi. Veuillez réessayer.');
                })
                .finally(function() {
                    // Reset button
                    submitBtn.html(originalText).prop('disabled', false);
                    console.log('🔄 Bouton de soumission réactivé');
                });
        } else {
            console.log('❌ Validation du formulaire échouée');
        }
        });
        
        // Alternative: Gestionnaire sur le bouton de soumission
        $('#formationForm button[type="submit"]').on('click', function(e) {
            console.log('🖱️ Clic sur le bouton de soumission détecté');
            e.preventDefault();
            e.stopPropagation();
            
            // Déclencher manuellement la soumission du formulaire
            $('#formationForm').trigger('submit');
        });
    });

    // Form validation function
    function validateForm() {
        console.log('🔍 Début de la validation du formulaire');
        
        var isValid = true;
        var form = document.getElementById('formationForm');
        var validationErrors = [];
        
        // Clear previous errors
        $(form).find('.is-invalid').removeClass('is-invalid');
        $(form).find('.invalid-feedback').text('');
        
        console.log('🧹 Erreurs précédentes effacées');
        
        // Validate required fields
        var requiredFields = ['fullName', 'email', 'phone', 'terms'];
        
        requiredFields.forEach(function(fieldName) {
            var field = form[fieldName];
            var feedback = $(field).siblings('.invalid-feedback');
            var fieldValue = fieldName === 'terms' ? field.checked : field.value.trim();
            
            console.log('📝 Validation du champ:', fieldName, 'Valeur:', fieldValue);
            
            if (fieldName === 'terms') {
                if (!field.checked) {
                    console.log('❌ Erreur: Conditions non acceptées');
                    $(field).addClass('is-invalid');
                    feedback.text('Vous devez accepter les conditions d\'inscription.');
                    validationErrors.push('Conditions non acceptées');
                    isValid = false;
                } else {
                    console.log('✅ Conditions acceptées');
                }
            } else {
                if (!fieldValue) {
                    console.log('❌ Erreur: Champ obligatoire vide:', fieldName);
                    $(field).addClass('is-invalid');
                    feedback.text('Ce champ est obligatoire.');
                    validationErrors.push(fieldName + ' est obligatoire');
                    isValid = false;
                } else if (fieldName === 'email' && !isValidEmail(field.value)) {
                    console.log('❌ Erreur: Email invalide:', field.value);
                    $(field).addClass('is-invalid');
                    feedback.text('Veuillez entrer une adresse email valide.');
                    validationErrors.push('Email invalide');
                    isValid = false;
                } else if (fieldName === 'phone' && !isValidPhone(field.value)) {
                    console.log('❌ Erreur: Téléphone invalide:', field.value);
                    $(field).addClass('is-invalid');
                    feedback.text('Veuillez entrer un numéro de téléphone valide.');
                    validationErrors.push('Téléphone invalide');
                    isValid = false;
                } else {
                    console.log('✅ Champ valide:', fieldName);
                }
            }
        });
        
        // Log du résultat de validation
        if (isValid) {
            console.log('✅ Validation réussie - Tous les champs sont valides');
        } else {
            console.log('❌ Validation échouée - Erreurs trouvées:');
            validationErrors.forEach(function(error) {
                console.log('  - ' + error);
            });
        }
        
        return isValid;
    }

    // Email validation
    function isValidEmail(email) {
        var emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        var isValid = emailRegex.test(email);
        console.log('📧 Validation email:', email, '→', isValid ? '✅ Valide' : '❌ Invalide');
        return isValid;
    }

    // Phone validation
    function isValidPhone(phone) {
        var phoneRegex = /^[\+]?[0-9\s\-\(\)]{10,}$/;
        var isValid = phoneRegex.test(phone);
        console.log('📱 Validation téléphone:', phone, '→', isValid ? '✅ Valide' : '❌ Invalide');
        return isValid;
    }

    // Send formation email
    function sendFormationEmail(formData) {
        return new Promise(function(resolve, reject) {
            console.log('📤 Fonction sendFormationEmail appelée');
            console.log('🔍 Vérification de la disponibilité d\'EmailJS...');
            console.log('🔍 Type d\'emailjs:', typeof emailjs);
            console.log('🔍 EmailJS disponible:', typeof emailjs !== 'undefined');
            
            // Force l'utilisation d'EmailJS pour localhost
            if (typeof emailjs !== 'undefined' && emailjs) {
                console.log('✅ EmailJS disponible, utilisation du service EmailJS');
                
                var templateParams = {
                    to_name: 'LAFRAOUZI Mouhssine',
                    from_name: formData.get('fullName'),
                    from_email: formData.get('email'),
                    phone: formData.get('phone'),
                    formation: formData.get('formation'),
                    experience: formData.get('experience') || 'Non spécifié',
                    message: formData.get('message') || 'Aucun message',
                    reply_to: formData.get('email'),
                    // Ajout de champs pour un template plus complet
                    user_name: formData.get('fullName'),
                    user_email: formData.get('email'),
                    user_phone: formData.get('phone'),
                    formation_name: formData.get('formation'),
                    user_experience: formData.get('experience') || 'Non spécifié',
                    user_message: formData.get('message') || 'Aucun message',
                    date_inscription: new Date().toLocaleString('fr-FR')
                };
                
                console.log('📋 Paramètres EmailJS:', templateParams);
                console.log('🚀 Envoi via EmailJS...');

                emailjs.send('service_hehpk9l', 'template_65fvvb2', templateParams)
                    .then(function(response) {
                        console.log('✅ EmailJS: Email envoyé avec succès');
                        console.log('📬 Réponse EmailJS:', response);
                        console.log('📊 Status:', response.status);
                        console.log('📝 Text:', response.text);
                        resolve(response);
                    })
                    .catch(function(error) {
                        console.error('❌ EmailJS: Échec de l\'envoi');
                        console.error('🔍 Erreur EmailJS:', error);
                        console.error('📊 Status:', error.status);
                        console.error('📝 Message:', error.text);
                        reject(error);
                    });
            } else {
                console.error('❌ EmailJS non disponible - Impossible d\'envoyer l\'email en localhost');
                console.error('💡 Solution: Vérifiez que le script EmailJS est chargé dans index.html');
                console.error('🔍 Debug info:');
                console.error('  - window.emailjs:', typeof window.emailjs);
                console.error('  - emailjs global:', typeof emailjs);
                console.error('  - Scripts chargés:', document.querySelectorAll('script[src*="emailjs"]').length);
                
                // Simulation d'un envoi réussi pour le test
                console.log('🧪 MODE TEST: Simulation d\'un envoi réussi');
                setTimeout(function() {
                    resolve({
                        status: 200,
                        text: 'Email simulé envoyé avec succès (mode test)',
                        test: true
                    });
                }, 1000);
            }
        });
    }

    // Show form error
    function showFormError(message) {
        console.error('🚨 Affichage d\'une erreur utilisateur:', message);
        
        // Create a more user-friendly error notification
        var errorHtml = `
            <div class="alert alert-danger alert-dismissible fade show" role="alert" style="position: fixed; top: 20px; right: 20px; z-index: 9999; min-width: 300px;">
                <i class="fas fa-exclamation-triangle"></i>
                <strong>Erreur d'envoi</strong><br>
                ${message}
                <button type="button" class="close" data-dismiss="alert" aria-label="Close">
                    <span aria-hidden="true">&times;</span>
                </button>
            </div>
        `;
        
        // Remove any existing error alerts
        $('.alert-danger').remove();
        
        // Add the new error alert
        $('body').append(errorHtml);
        
        // Auto-remove after 5 seconds
        setTimeout(function() {
            $('.alert-danger').fadeOut(function() {
                $(this).remove();
            });
        }, 5000);
        
        console.log('📢 Notification d\'erreur affichée à l\'utilisateur');
    }

    // Real-time form validation
    $('#formationForm input, #formationForm select, #formationForm textarea').on('blur', function() {
        var field = this;
        var feedback = $(field).siblings('.invalid-feedback');
        var fieldName = field.name || field.id || 'champ inconnu';
        
        console.log('🔍 Validation en temps réel du champ:', fieldName, 'Valeur:', field.value);
        
        if (field.hasAttribute('required') && !field.value.trim()) {
            console.log('❌ Champ obligatoire vide:', fieldName);
            $(field).addClass('is-invalid');
            feedback.text('Ce champ est obligatoire.');
        } else if (field.type === 'email' && field.value && !isValidEmail(field.value)) {
            console.log('❌ Email invalide en temps réel:', field.value);
            $(field).addClass('is-invalid');
            feedback.text('Veuillez entrer une adresse email valide.');
        } else if (field.type === 'tel' && field.value && !isValidPhone(field.value)) {
            console.log('❌ Téléphone invalide en temps réel:', field.value);
            $(field).addClass('is-invalid');
            feedback.text('Veuillez entrer un numéro de téléphone valide.');
        } else {
            console.log('✅ Champ valide en temps réel:', fieldName);
            $(field).removeClass('is-invalid');
            feedback.text('');
        }
    });


    // Clear form when modal is hidden
    $('#formationModal').on('hidden.bs.modal', function() {
        console.log('🧹 Fermeture du modal - Réinitialisation du formulaire');
        var form = document.getElementById('formationForm');
        form.reset();
        $(form).find('.is-invalid').removeClass('is-invalid');
        $(form).find('.invalid-feedback').text('');
        selectedFormation = null;
        console.log('✅ Formulaire réinitialisé');
    });
    
})(jQuery);

