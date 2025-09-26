<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST');
header('Access-Control-Allow-Headers: Content-Type');

// Configuration email
$to_email = "lafraouzimouhssine@gmail.com"; // Remplacez par votre email
$subject = "Nouvelle inscription à une formation";

// Vérifier si la requête est en POST
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['success' => false, 'message' => 'Méthode non autorisée']);
    exit;
}

// Récupérer les données du formulaire
$fullName = isset($_POST['fullName']) ? trim($_POST['fullName']) : '';
$email = isset($_POST['email']) ? trim($_POST['email']) : '';
$phone = isset($_POST['phone']) ? trim($_POST['phone']) : '';
$formation = isset($_POST['formation']) ? trim($_POST['formation']) : '';
$experience = isset($_POST['experience']) ? trim($_POST['experience']) : '';
$message = isset($_POST['message']) ? trim($_POST['message']) : '';

// Validation des champs obligatoires
$errors = [];

if (empty($fullName)) {
    $errors[] = 'Le nom complet est obligatoire';
}

if (empty($email)) {
    $errors[] = 'L\'email est obligatoire';
} elseif (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    $errors[] = 'L\'email n\'est pas valide';
}

if (empty($phone)) {
    $errors[] = 'Le numéro de téléphone est obligatoire';
}

if (empty($formation)) {
    $errors[] = 'La formation est obligatoire';
}

// Si il y a des erreurs, les retourner
if (!empty($errors)) {
    http_response_code(400);
    echo json_encode(['success' => false, 'message' => implode(', ', $errors)]);
    exit;
}

// Préparer le contenu de l'email avec un template professionnel
$email_content = "
<!DOCTYPE html>
<html lang='fr'>
<head>
    <meta charset='UTF-8'>
    <meta name='viewport' content='width=device-width, initial-scale=1.0'>
    <title>Nouvelle inscription à une formation</title>
    <style>
        body { 
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; 
            line-height: 1.6; 
            color: #333; 
            margin: 0; 
            padding: 0; 
            background-color: #f4f4f4;
        }
        .email-container { 
            max-width: 600px; 
            margin: 20px auto; 
            background: white;
            border-radius: 15px;
            overflow: hidden;
            box-shadow: 0 10px 30px rgba(0,0,0,0.1);
        }
        .header { 
            background: linear-gradient(135deg, #EF233C 0%, #d63031 100%); 
            color: white; 
            padding: 30px 20px; 
            text-align: center; 
            position: relative;
        }
        .header::before {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: url('data:image/svg+xml,<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 100 100\"><defs><pattern id=\"grain\" width=\"100\" height=\"100\" patternUnits=\"userSpaceOnUse\"><circle cx=\"25\" cy=\"25\" r=\"1\" fill=\"white\" opacity=\"0.1\"/><circle cx=\"75\" cy=\"75\" r=\"1\" fill=\"white\" opacity=\"0.1\"/><circle cx=\"50\" cy=\"10\" r=\"0.5\" fill=\"white\" opacity=\"0.1\"/></pattern></defs><rect width=\"100\" height=\"100\" fill=\"url(%23grain)\"/></svg>');
            opacity: 0.3;
        }
        .header h1 { 
            margin: 0; 
            font-size: 28px; 
            font-weight: 700;
            position: relative;
            z-index: 1;
        }
        .header p { 
            margin: 10px 0 0 0; 
            font-size: 16px; 
            opacity: 0.9;
            position: relative;
            z-index: 1;
        }
        .content { 
            padding: 40px 30px; 
            background: #ffffff;
        }
        .highlight-box {
            background: linear-gradient(135deg, #fff3cd 0%, #ffeaa7 100%);
            border: 2px solid #ffc107;
            border-radius: 12px;
            padding: 20px;
            margin-bottom: 30px;
            text-align: center;
        }
        .highlight-box h3 {
            margin: 0 0 10px 0;
            color: #856404;
            font-size: 20px;
        }
        .highlight-box p {
            margin: 0;
            color: #856404;
            font-weight: 600;
            font-size: 18px;
        }
        .info-grid {
            display: grid;
            gap: 15px;
            margin-bottom: 30px;
        }
        .info-row { 
            background: #f8f9fa; 
            border-radius: 10px; 
            padding: 20px; 
            border-left: 5px solid #EF233C;
            transition: all 0.3s ease;
            box-shadow: 0 2px 5px rgba(0,0,0,0.05);
        }
        .info-row:hover {
            transform: translateX(5px);
            box-shadow: 0 4px 15px rgba(0,0,0,0.1);
        }
        .label { 
            font-weight: 700; 
            color: #EF233C; 
            display: block;
            margin-bottom: 8px;
            font-size: 14px;
            text-transform: uppercase;
            letter-spacing: 0.5px;
        }
        .value {
            color: #333;
            font-size: 16px;
            font-weight: 500;
        }
        .message-box {
            background: #e3f2fd;
            border: 2px solid #2196f3;
            border-radius: 10px;
            padding: 20px;
            margin: 20px 0;
        }
        .message-box .label {
            color: #1976d2;
        }
        .footer { 
            background: #2c3e50; 
            color: white; 
            padding: 25px; 
            text-align: center; 
            font-size: 14px;
        }
        .footer p { 
            margin: 5px 0; 
        }
        .footer a {
            color: #EF233C;
            text-decoration: none;
            font-weight: 600;
        }
        .footer a:hover {
            text-decoration: underline;
        }
        .action-required {
            background: linear-gradient(135deg, #ff6b6b 0%, #ee5a52 100%);
            color: white;
            padding: 15px;
            border-radius: 8px;
            margin-top: 20px;
            text-align: center;
            font-weight: 600;
        }
        .icon {
            display: inline-block;
            margin-right: 8px;
            font-size: 18px;
        }
        @media (max-width: 600px) {
            .email-container {
                margin: 10px;
                border-radius: 10px;
            }
            .header {
                padding: 20px 15px;
            }
            .header h1 {
                font-size: 24px;
            }
            .content {
                padding: 25px 20px;
            }
            .info-row {
                padding: 15px;
            }
        }
    </style>
</head>
<body>
    <div class='email-container'>
        <div class='header'>
            <h1>🎓 Nouvelle Inscription</h1>
            <p>Une personne souhaite suivre une de vos formations</p>
        </div>
        
        <div class='content'>
            <div class='highlight-box'>
                <h3>📋 Formation Demandée</h3>
                <p>" . htmlspecialchars($formation) . "</p>
            </div>
            
            <div class='info-grid'>
                <div class='info-row'>
                    <span class='label'><span class='icon'>👤</span>Nom Complet</span>
                    <div class='value'>" . htmlspecialchars($fullName) . "</div>
                </div>
                
                <div class='info-row'>
                    <span class='label'><span class='icon'>📧</span>Adresse Email</span>
                    <div class='value'>" . htmlspecialchars($email) . "</div>
                </div>
                
                <div class='info-row'>
                    <span class='label'><span class='icon'>📱</span>Numéro de Téléphone</span>
                    <div class='value'>" . htmlspecialchars($phone) . "</div>
                </div>
                
                <div class='info-row'>
                    <span class='label'><span class='icon'>🎯</span>Niveau d'Expérience</span>
                    <div class='value'>" . htmlspecialchars($experience ?: 'Non spécifié') . "</div>
                </div>
                
                <div class='info-row'>
                    <span class='label'><span class='icon'>📅</span>Date d'Inscription</span>
                    <div class='value'>" . date('d/m/Y à H:i') . "</div>
                </div>
            </div>
            
            " . (!empty($message) ? "
            <div class='message-box'>
                <span class='label'><span class='icon'>💬</span>Message Personnel</span>
                <div class='value' style='margin-top: 10px; font-style: italic;'>" . nl2br(htmlspecialchars($message)) . "</div>
            </div>
            " : "") . "
            
            <div class='action-required'>
                ⚡ Action Requise : Contacter l'utilisateur pour confirmer sa place
            </div>
        </div>
        
        <div class='footer'>
            <p><strong>📧 Email automatique</strong></p>
            <p>Cette inscription a été envoyée depuis votre site portfolio</p>
            <p>Répondez directement à cet email pour contacter l'utilisateur</p>
            <p style='margin-top: 15px; font-size: 12px; opacity: 0.8;'>
                © " . date('Y') . " - Portfolio LAFRAOUZI
            </p>
        </div>
    </div>
</body>
</html>
";

// En-têtes de l'email
$headers = [
    'MIME-Version: 1.0',
    'Content-type: text/html; charset=UTF-8',
    'From: ' . $fullName . ' <' . $email . '>',
    'Reply-To: ' . $email,
    'X-Mailer: PHP/' . phpversion()
];

// Envoyer l'email
$mail_sent = mail($to_email, $subject, $email_content, implode("\r\n", $headers));

if ($mail_sent) {
    // Email de confirmation pour l'utilisateur avec template professionnel
    $user_subject = "✅ Confirmation d'inscription - " . $formation;
    $user_content = "
    <!DOCTYPE html>
    <html lang='fr'>
    <head>
        <meta charset='UTF-8'>
        <meta name='viewport' content='width=device-width, initial-scale=1.0'>
        <title>Confirmation d'inscription</title>
        <style>
            body { 
                font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; 
                line-height: 1.6; 
                color: #333; 
                margin: 0; 
                padding: 0; 
                background-color: #f4f4f4;
            }
            .email-container { 
                max-width: 600px; 
                margin: 20px auto; 
                background: white;
                border-radius: 15px;
                overflow: hidden;
                box-shadow: 0 10px 30px rgba(0,0,0,0.1);
            }
            .header { 
                background: linear-gradient(135deg, #28a745 0%, #20c997 100%); 
                color: white; 
                padding: 40px 20px; 
                text-align: center; 
                position: relative;
            }
            .header::before {
                content: '';
                position: absolute;
                top: 0;
                left: 0;
                right: 0;
                bottom: 0;
                background: url('data:image/svg+xml,<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 100 100\"><defs><pattern id=\"grain\" width=\"100\" height=\"100\" patternUnits=\"userSpaceOnUse\"><circle cx=\"25\" cy=\"25\" r=\"1\" fill=\"white\" opacity=\"0.1\"/><circle cx=\"75\" cy=\"75\" r=\"1\" fill=\"white\" opacity=\"0.1\"/><circle cx=\"50\" cy=\"10\" r=\"0.5\" fill=\"white\" opacity=\"0.1\"/></pattern></defs><rect width=\"100\" height=\"100\" fill=\"url(%23grain)\"/></svg>');
                opacity: 0.3;
            }
            .success-icon {
                font-size: 60px;
                margin-bottom: 20px;
                position: relative;
                z-index: 1;
            }
            .header h1 { 
                margin: 0; 
                font-size: 28px; 
                font-weight: 700;
                position: relative;
                z-index: 1;
            }
            .header p { 
                margin: 10px 0 0 0; 
                font-size: 16px; 
                opacity: 0.9;
                position: relative;
                z-index: 1;
            }
            .content { 
                padding: 40px 30px; 
                background: #ffffff;
            }
            .greeting {
                font-size: 24px;
                font-weight: 600;
                color: #2c3e50;
                margin-bottom: 20px;
            }
            .formation-highlight {
                background: linear-gradient(135deg, #e8f5e8 0%, #d4edda 100%);
                border: 2px solid #28a745;
                border-radius: 12px;
                padding: 25px;
                margin: 25px 0;
                text-align: center;
            }
            .formation-highlight h3 {
                margin: 0 0 10px 0;
                color: #155724;
                font-size: 20px;
            }
            .formation-highlight p {
                margin: 0;
                color: #155724;
                font-weight: 600;
                font-size: 18px;
            }
            .info-box {
                background: #f8f9fa;
                border-radius: 10px;
                padding: 25px;
                margin: 25px 0;
                border-left: 5px solid #28a745;
            }
            .info-box h4 {
                color: #28a745;
                margin: 0 0 15px 0;
                font-size: 18px;
            }
            .info-box ul {
                margin: 0;
                padding-left: 20px;
            }
            .info-box li {
                margin-bottom: 8px;
                color: #333;
            }
            .next-steps {
                background: linear-gradient(135deg, #fff3cd 0%, #ffeaa7 100%);
                border: 2px solid #ffc107;
                border-radius: 12px;
                padding: 25px;
                margin: 25px 0;
            }
            .next-steps h4 {
                color: #856404;
                margin: 0 0 15px 0;
                font-size: 18px;
            }
            .next-steps p {
                margin: 0;
                color: #856404;
            }
            .contact-info {
                background: #e3f2fd;
                border: 2px solid #2196f3;
                border-radius: 10px;
                padding: 20px;
                margin: 25px 0;
                text-align: center;
            }
            .contact-info h4 {
                color: #1976d2;
                margin: 0 0 10px 0;
            }
            .contact-info p {
                margin: 5px 0;
                color: #1976d2;
            }
            .footer { 
                background: #2c3e50; 
                color: white; 
                padding: 25px; 
                text-align: center; 
                font-size: 14px;
            }
            .footer p { 
                margin: 5px 0; 
            }
            .signature {
                margin-top: 30px;
                padding-top: 20px;
                border-top: 2px solid #e9ecef;
                text-align: center;
            }
            .signature p {
                margin: 5px 0;
                color: #6c757d;
            }
            .signature strong {
                color: #EF233C;
                font-size: 18px;
            }
            @media (max-width: 600px) {
                .email-container {
                    margin: 10px;
                    border-radius: 10px;
                }
                .header {
                    padding: 30px 15px;
                }
                .header h1 {
                    font-size: 24px;
                }
                .content {
                    padding: 25px 20px;
                }
                .greeting {
                    font-size: 20px;
                }
            }
        </style>
    </head>
    <body>
        <div class='email-container'>
            <div class='header'>
                <div class='success-icon'>🎉</div>
                <h1>Inscription Confirmée !</h1>
                <p>Votre demande a été reçue avec succès</p>
            </div>
            
            <div class='content'>
                <div class='greeting'>
                    Bonjour " . htmlspecialchars($fullName) . ",
                </div>
                
                <p>Nous avons le plaisir de vous confirmer que votre inscription à notre formation a été reçue avec succès !</p>
                
                <div class='formation-highlight'>
                    <h3>📚 Formation Inscrite</h3>
                    <p>" . htmlspecialchars($formation) . "</p>
                </div>
                
                <div class='info-box'>
                    <h4>📋 Détails de votre inscription</h4>
                    <ul>
                        <li><strong>Nom :</strong> " . htmlspecialchars($fullName) . "</li>
                        <li><strong>Email :</strong> " . htmlspecialchars($email) . "</li>
                        <li><strong>Téléphone :</strong> " . htmlspecialchars($phone) . "</li>
                        <li><strong>Niveau :</strong> " . htmlspecialchars($experience ?: 'Non spécifié') . "</li>
                        <li><strong>Date d'inscription :</strong> " . date('d/m/Y à H:i') . "</li>
                    </ul>
                </div>
                
                <div class='next-steps'>
                    <h4>⏭️ Prochaines étapes</h4>
                    <p>Notre équipe va examiner votre demande et vous contacter dans les <strong>24-48 heures</strong> pour :</p>
                    <ul>
                        <li>Confirmer votre place dans la formation</li>
                        <li>Vous envoyer le programme détaillé</li>
                        <li>Vous donner toutes les informations pratiques</li>
                        <li>Répondre à vos éventuelles questions</li>
                    </ul>
                </div>
                
                <div class='contact-info'>
                    <h4>📞 Besoin d'aide ?</h4>
                    <p>Si vous avez des questions urgentes, n'hésitez pas à nous contacter :</p>
                    <p><strong>Email :</strong> lafraouzimouhssine@gmail.com</p>
                </div>
                
                <p style='font-size: 16px; color: #28a745; font-weight: 600; text-align: center; margin: 30px 0;'>
                    Merci pour votre confiance et à bientôt ! 🚀
                </p>
                
                <div class='signature'>
                    <p><strong>L'équipe Formation</strong></p>
                    <p>Portfolio LAFRAOUZI</p>
                    <p>Développement & Formation</p>
                </div>
            </div>
            
            <div class='footer'>
                <p><strong>📧 Email automatique</strong></p>
                <p>Cet email confirme votre inscription à notre formation</p>
                <p style='margin-top: 15px; font-size: 12px; opacity: 0.8;'>
                    © " . date('Y') . " - Portfolio LAFRAOUZI
                </p>
            </div>
        </div>
    </body>
    </html>
    ";
    
    $user_headers = [
        'MIME-Version: 1.0',
        'Content-type: text/html; charset=UTF-8',
        'From: Formation Team <noreply@votre-site.com>',
        'X-Mailer: PHP/' . phpversion()
    ];
    
    mail($email, $user_subject, $user_content, implode("\r\n", $user_headers));
    
    echo json_encode(['success' => true, 'message' => 'Inscription envoyée avec succès']);
} else {
    http_response_code(500);
    echo json_encode(['success' => false, 'message' => 'Erreur lors de l\'envoi de l\'email']);
}
?>
