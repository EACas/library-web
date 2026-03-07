<?php
session_start();
header('Content-Type: application/json');

$response = ["success" => false, "message" => "User not logged in"];

// Check if session exists
if (!isset($_SESSION['user_id']) || !isset($_SESSION['role_id'])) {
    echo json_encode($response);
    exit;
}

// Allowed roles from GET parameter
$allowed_roles = [];
if (isset($_GET['roles'])) {
    $allowed_roles = array_map('intval', explode(',', $_GET['roles']));
}

// Check if user's role is allowed
if (!in_array($_SESSION['role_id'], $allowed_roles)) {
    $response["message"] = "Access denied: insufficient permissions";
    echo json_encode($response);
    exit;
}

// User authorized
$response = [
    "success" => true,
    "user_id" => $_SESSION['user_id'],
    "role_id" => $_SESSION['role_id'],
    "f_name" => $_SESSION['f_name'],
    "l_name" => $_SESSION['l_name']
];

echo json_encode($response);