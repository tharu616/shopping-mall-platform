package com.mall.payment.validation;

public class PaymentValidatorFactory {

    public static PaymentValidator getValidator(String paymentMethod) {
        if (paymentMethod == null || paymentMethod.isBlank()) {
            throw new IllegalArgumentException("Payment method cannot be null or empty");
        }

        return switch (paymentMethod.trim().toUpperCase()) {
            case "CARD" -> new CardPaymentValidator();
            case "BANK_TRANSFER" -> new BankTransferValidator();
            case "PAYPAL" -> new PayPalValidator();
            case "CASH_ON_DELIVERY" -> new CashOnDeliveryValidator();
            default -> throw new IllegalArgumentException("Unsupported payment method: " + paymentMethod);
        };
    }
}
