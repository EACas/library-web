<?php
header("Content-Type: application/json");
require_once "../core/database.php";

if ($_SERVER["REQUEST_METHOD"] !== "POST") {
    echo json_encode(["success" => false, "message" => "Invalid request method"]);
    exit;
}

$user_library_id = trim($_POST["user_library_id"] ?? "");
$f_name          = trim($_POST["f_name"]          ?? "");
$l_name          = trim($_POST["l_name"]          ?? "");
$email           = trim($_POST["email"]           ?? "");
$password        = $_POST["password"]             ?? "";
$phone_number    = trim($_POST["phone_number"]    ?? "");
$gender          = (int)($_POST["gender"]         ?? 0);
$dob             = $_POST["dob"]                  ?? "";

if (!$user_library_id || !$f_name || !$l_name || !$email || !$password || !$phone_number || !$gender || !$dob) {
    echo json_encode(["success" => false, "message" => "All fields are required"]);
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

// Check duplicate student ID
$check = $conn->prepare("SELECT user_id FROM users WHERE user_library_id = ?");
$check->bind_param("s", $user_library_id);
$check->execute();
$check->store_result();
if ($check->num_rows > 0) {
    echo json_encode(["success" => false, "message" => "Student ID already in use"]);
    $check->close();
    exit;
}
$check->close();

$hashed_password = password_hash($password, PASSWORD_BCRYPT);
$role_id         = 3; // student
$account_status  = 1; // active
$library_id      = 1;

$conn->begin_transaction();

try {
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

    $balance    = 0.0;
    $created_at = date("Y-m-d H:i:s");
    $stmt = $conn->prepare("INSERT INTO students (user_id, account_balance, created_at) VALUES (?, ?, ?)");
    $stmt->bind_param("ids", $user_id, $balance, $created_at);
    $stmt->execute();
    $stmt->close();

    $conn->commit();
    echo json_encode(["success" => true, "message" => "Student registered successfully"]);

} catch (Exception $e) {
    $conn->rollback();
    echo json_encode(["success" => false, "message" => "Error: " . $e->getMessage()]);
}

$conn->close();
?>