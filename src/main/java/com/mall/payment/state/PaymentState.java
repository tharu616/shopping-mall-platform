package com.mall.payment.state;

import com.mall.payment.PaymentStatus;
import java.util.List;

public interface PaymentState {
    boolean canTransitionTo(PaymentStatus newStatus);
    List<PaymentStatus> getAllowedTransitions();
}

class PendingPaymentState implements PaymentState {
    @Override
    public boolean canTransitionTo(PaymentStatus newStatus) {
        return newStatus == PaymentStatus.VERIFIED || newStatus == PaymentStatus.REJECTED;
    }

    @Override
    public List<PaymentStatus> getAllowedTransitions() {
        return List.of(PaymentStatus.VERIFIED, PaymentStatus.REJECTED);
    }
}

class VerifiedPaymentState implements PaymentState {
    @Override
    public boolean canTransitionTo(PaymentStatus newStatus) {
        return false; // Terminal state
    }

    @Override
    public List<PaymentStatus> getAllowedTransitions() {
        return List.of();
    }
}

class RejectedPaymentState implements PaymentState {
    @Override
    public boolean canTransitionTo(PaymentStatus newStatus) {
        return newStatus == PaymentStatus.PENDING; // Allow resubmission
    }

    @Override
    public List<PaymentStatus> getAllowedTransitions() {
        return List.of(PaymentStatus.PENDING);
    }
}

