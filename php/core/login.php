<?php
include "database.php";
session_start();

header('Content-Type: application/json');

$response = ["success" => false, "message" => "Invalid credentials"];

// Get POST data
$email = $_POST['email'] ?? '';
$upass = $_POST['password'] ?? '';

if (!$email || !$upass) {
    echo json_encode($response);
    exit;
}

// Find user by email
$stmt = $conn->prepare("SELECT user_id, f_name, l_name, password, role_id, account_status FROM users WHERE email=?");
$stmt->bind_param("s", $email);
$stmt->execute();
$result = $stmt->get_result();

if ($result->num_rows > 0) {
    $user = $result->fetch_assoc();

    if ($user['account_status'] != 1) {
        $response['message'] = "Account inactive";
    } else if (password_verify($upass, $user['password'])) {
        // Save session
        $_SESSION['user_id'] = $user['user_id'];
        $_SESSION['role_id'] = $user['role_id'];
        $_SESSION['f_name'] = $user['f_name'];
        $_SESSION['l_name'] = $user['l_name'];

        $response = [
            "success" => true,
            "user_id" => $user['user_id'],
            "role_id" => $user['role_id'],
            "f_name" => $user['f_name'],
            "l_name" => $user['l_name']
        ];
    } else {
        $response['message'] = "Wrong password";
    }
} else {
    $response['message'] = "User not found";
}

echo json_encode($response);