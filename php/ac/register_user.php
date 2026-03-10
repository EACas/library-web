<?php

header("Content-Type: application/json");
require_once "../core/database.php";

if ($_SERVER["REQUEST_METHOD"] !== "POST") {
    echo json_encode(["success" => false, "message" => "Invalid request method"]);
    exit;
}

$f_name       = trim($_POST["firstname"]    ?? "");
$l_name       = trim($_POST["lastname"]     ?? "");
$email        = trim($_POST["email"]        ?? "");
$password     = $_POST["password"]          ?? "";
$phone_number = trim($_POST["phone"]        ?? "");
$gender       = (int)($_POST["gender"]      ?? 0);
$dob          = $_POST["dob"]               ?? "";
$role_id      = (int)($_POST["role"]        ?? 0);

// Validate
if (!$f_name || !$l_name || !$email || !$password || !$gender || !$dob || !$role_id) {
    echo json_encode(["success" => false, "message" => "All fields are required"]);
    exit;
}

if (!in_array($role_id, [1, 2, 3])) {
    echo json_encode(["success" => false, "message" => "Invalid role"]);
    exit;
}

// Check duplicate email
$check = $conn->prepare("SELECT user_id FROM users WHERE email = ?");
$check->bind_param("s", $email);
$check->execute();
$check->store_result();
if ($check->num_rows > 0) {
    echo json_encode(["success" => false, "message" => "Email already registered"]);
    $check->close();
    exit;
}
$check->close();

$user_library_id = "LIB" . bin2hex(random_bytes(8));
$hashed_password = password_hash($password, PASSWORD_BCRYPT);
$account_status  = 1; // active
$library_id      = 1; // default library

$conn->begin_transaction();

try {
    // Insert into users
    $stmt = $conn->prepare("
        INSERT INTO users
            (user_library_id, email, f_name, l_name, phone_number, gender, password, dob, account_status, library_id, role_id)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    ");
    $stmt->bind_param(
    "sssssissiii",
    $user_library_id, $email, $f_name, $l_name, $phone_number,
    $gender, $hashed_password, $dob, $account_status, $library_id, $role_id
);
    $stmt->execute();
    $user_id = $conn->insert_id;
    $stmt->close();

    // Insert into role-specific table
    if ($role_id === 3) {
        // Student
        $balance    = 0.0;
        $created_at = date("Y-m-d H:i:s");
        $stmt = $conn->prepare("INSERT INTO students (user_id, account_balance, created_at) VALUES (?, ?, ?)");
        $stmt->bind_param("ids", $user_id, $balance, $created_at);
        $stmt->execute();
        $stmt->close();

    } elseif ($role_id === 2) {
        $salary  = (float)($_POST["salary"] ?? 0.0);
        $balance = 0.0;
        $began   = date("Y-m-d H:i:s");
        $stmt = $conn->prepare("INSERT INTO librarians (user_id, salary, began_at, account_balance) VALUES (?, ?, ?, ?)");
        $stmt->bind_param("idsd", $user_id, $salary, $began, $balance);
        $stmt->execute();
        $stmt->close();
}

    $conn->commit();

    $roleNames = [1 => "Admin", 2 => "Librarian", 3 => "Student"];
    echo json_encode(["success" => true, "message" => $roleNames[$role_id] . " registered successfully"]);

} catch (Exception $e) {
    $conn->rollback();
    echo json_encode(["success" => false, "message" => "Error: " . $e->getMessage()]);
}

$conn->close();
?>