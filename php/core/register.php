<?php
header('Content-Type: application/json');
include 'database.php';

$role = $_POST['role'];
$firstname = $_POST['firstname'];
$lastname = $_POST['lastname'];
$gender = $_POST['gender'];
$email = $_POST['email'];
$phone = $_POST['phone'];
$dob = $_POST['dob'];
$password = $_POST['password'];

// Default values
$user_library_id = uniqid("LIB");
$account_status = 1;
$library_id = 1;

// hash password
$password = password_hash($password, PASSWORD_DEFAULT);

// check if email exists
$check = $conn->prepare("SELECT user_id FROM users WHERE email = ?");
$check->bind_param("s", $email);
$check->execute();
$check->store_result();

if($check->num_rows > 0){
    echo json_encode([
        "success" => false,
        "message" => "Email already exists"
    ]);
    exit;
}

// insert user
$sql = "INSERT INTO users 
(user_library_id,email,f_name,l_name,phone_number,gender,password,dob,account_status,library_id,role_id)
VALUES (?,?,?,?,?,?,?,?,?,?,?)";

$stmt = $conn->prepare($sql);

$stmt->bind_param(
    "sssssissiii",
    $user_library_id,
    $email,
    $firstname,
    $lastname,
    $phone,
    $gender,
    $password,
    $dob,
    $account_status,
    $library_id,
    $role
);

if($stmt->execute()){
    echo json_encode([
        "success"=>true,
        "id_user"=>$stmt->insert_id
    ]);
}else{
    echo json_encode([
        "success"=>false,
        "message"=>$stmt->error
    ]);
}

$stmt->close();
$conn->close();
?>