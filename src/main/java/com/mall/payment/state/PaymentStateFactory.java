package com.mall.payment.state;

import com.mall.payment.PaymentStatus;

public class PaymentStateFactory {
    public static PaymentState getState(PaymentStatus status) {
        return switch (status) {
            case PENDING -> new PendingPaymentState();
            case VERIFIED -> new VerifiedPaymentState();
            case REJECTED -> new RejectedPaymentState();
        };
    }
}
