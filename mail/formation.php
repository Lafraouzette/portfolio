<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST');
header('Access-Control-Allow-Headers: Content-Type');

// Configuration email
$to_email = "votre-email@example.com"; // Remplacez par votre email
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

// Préparer le contenu de l'email
$email_content = "
<!DOCTYPE html>
<html>
<head>
    <meta charset='UTF-8'>
    <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: linear-gradient(135deg, #EF233C 0%, #d63031 100%); color: white; padding: 20px; text-align: center; border-radius: 10px 10px 0 0; }
        .content { background: #f8f9fa; padding: 30px; border-radius: 0 0 10px 10px; }
        .info-row { margin-bottom: 15px; padding: 10px; background: white; border-radius: 5px; border-left: 4px solid #EF233C; }
        .label { font-weight: bold; color: #EF233C; }
        .footer { text-align: center; margin-top: 20px; color: #666; font-size: 12px; }
    </style>
</head>
<body>
    <div class='container'>
        <div class='header'>
            <h2>🎓 Nouvelle inscription à une formation</h2>
        </div>
        <div class='content'>
            <div class='info-row'>
                <span class='label'>Formation :</span> " . htmlspecialchars($formation) . "
            </div>
            <div class='info-row'>
                <span class='label'>Nom complet :</span> " . htmlspecialchars($fullName) . "
            </div>
            <div class='info-row'>
                <span class='label'>Email :</span> " . htmlspecialchars($email) . "
            </div>
            <div class='info-row'>
                <span class='label'>Téléphone :</span> " . htmlspecialchars($phone) . "
            </div>
            <div class='info-row'>
                <span class='label'>Niveau d'expérience :</span> " . htmlspecialchars($experience ?: 'Non spécifié') . "
            </div>
            <div class='info-row'>
                <span class='label'>Message :</span> " . htmlspecialchars($message ?: 'Aucun message') . "
            </div>
            <div class='info-row'>
                <span class='label'>Date d'inscription :</span> " . date('d/m/Y à H:i') . "
            </div>
        </div>
        <div class='footer'>
            <p>Cette inscription a été envoyée depuis votre site portfolio.</p>
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
    // Email de confirmation pour l'utilisateur
    $user_subject = "Confirmation d'inscription - " . $formation;
    $user_content = "
    <!DOCTYPE html>
    <html>
    <head>
        <meta charset='UTF-8'>
        <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #EF233C 0%, #d63031 100%); color: white; padding: 20px; text-align: center; border-radius: 10px 10px 0 0; }
            .content { background: #f8f9fa; padding: 30px; border-radius: 0 0 10px 10px; }
            .success-icon { text-align: center; font-size: 48px; margin-bottom: 20px; }
            .footer { text-align: center; margin-top: 20px; color: #666; font-size: 12px; }
        </style>
    </head>
    <body>
        <div class='container'>
            <div class='header'>
                <h2>✅ Inscription confirmée</h2>
            </div>
            <div class='content'>
                <div class='success-icon'>🎉</div>
                <h3>Bonjour " . htmlspecialchars($fullName) . ",</h3>
                <p>Nous avons bien reçu votre inscription à la formation <strong>" . htmlspecialchars($formation) . "</strong>.</p>
                <p>Notre équipe va examiner votre demande et vous contacter dans les plus brefs délais pour confirmer votre place et vous donner tous les détails nécessaires.</p>
                <p>Merci pour votre confiance !</p>
                <p><strong>L'équipe Formation</strong></p>
            </div>
            <div class='footer'>
                <p>Cet email a été envoyé automatiquement. Merci de ne pas y répondre.</p>
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
