<?php

return [
    'vnp_TmnCode'    => 'RLC3J5EK', 
    'vnp_HashSecret' => 'JXX074CPHU8MNJX2YD1U04UGDM9NXMQL',
    'vnp_Url'        => 'https://sandbox.vnpayment.vn/paymentv2/vpcpay.html',
    'vnp_ReturnUrl'  => env('APP_URL') . '/payment/vnpay/return',
    'vnp_IpnUrl'     => env('APP_URL') . '/payment/vnpay/ipn',
];
