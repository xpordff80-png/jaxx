<?php
// Database connection
$db_host = 'localhost';
$db_username = 'root';
$db_password = '';
$db_name = 'gift_cards';

$conn = new mysqli($db_host, $db_username, $db_password, $db_name);
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

// Purchase gift card
function purchase_gift_card() {
    global $conn;

    if (!isset($_POST['purchase'])) return;

    $card_number = $_POST['purchase_card_number'];
    $amount = $_POST['purchase_amount'];

    if (!preg_match('/^[0-9]{16}$/', $card_number)) {
        echo '<p style="color:red;">رقم الكرت غير صالح</p>';
        return;
    }

    if ($amount < 1) {
        echo '<p style="color:red;">المبلغ غير صالح</p>';
        return;
    }

    $stmt = $conn->prepare("INSERT INTO gift_cards (card_number, amount) VALUES (?, ?)");
    $stmt->bind_param("si", $card_number, $amount);

    if ($stmt->execute()) {
        echo '<p style="color:green;">تم شراء الكرت بنجاح</p>';
    } else {
        echo '<p style="color:red;">خطأ: ' . $stmt->error . '</p>';
    }

    $stmt->close();
}

// Redeem gift card
function redeem_gift_card() {
    global $conn;

    if (!isset($_POST['redeem'])) return;

    $card_number = $_POST['redeem_card_number'];

    if (!preg_match('/^[0-9]{16}$/', $card_number)) {
        echo '<p style="color:red;">رقم الكرت غير صالح</p>';
        return;
    }

    $stmt = $conn->prepare("SELECT amount FROM gift_cards WHERE card_number=?");
    $stmt->bind_param("s", $card_number);
    $stmt->execute();
    $result = $stmt->get_result();

    if ($result->num_rows > 0) {
        $row = $result->fetch_assoc();
        $amount = $row['amount'];
        echo "<p style='color:green;'>تم استرداد الكرت بنجاح. المبلغ: $amount</p>";
    } else {
        echo '<p style="color:red;">الكرت غير موجود</p>';
    }

    $stmt->close();
}

// Display all gift cards
function display_gift_cards() {
    global $conn;

    $sql = "SELECT * FROM gift_cards";
    $result = $conn->query($sql);

    if ($result->num_rows > 0) {
        while ($row = $result->fetch_assoc()) {
            echo '<p>رقم الكرت: ' . $row['card_number'] . '</p>';
            echo '<p>المبلغ: ' . $row['amount'] . '</p><hr>';
        }
    } else {
        echo '<p>لا توجد كروت متوفرة</p>';
    }
}

// Call functions
purchase_gift_card();
redeem_gift_card();

$conn->close();
?>
