package com.mall.payment.validation;

import com.mall.payment.dto.UploadPaymentRequest;
import java.util.ArrayList;
import java.util.List;

public interface PaymentValidator {
    List<String> validate(UploadPaymentRequest req);
}

// Strategy implementations
class CardPaymentValidator implements PaymentValidator {
    @Override
    public List<String> validate(UploadPaymentRequest req) {
        List<String> errors = new ArrayList<>();

        if (req.cardNumber() == null || req.cardNumber().replaceAll("\\s", "").length() < 13 || req.cardNumber().replaceAll("\\s", "").length() > 19) {
            errors.add("Card number must be between 13-19 digits");
        }

        if (req.cardNumber() != null && !luhnCheck(req.cardNumber().replaceAll("\\s", ""))) {
            errors.add("Invalid card number (failed Luhn check)");
        }

        if (req.cardHolderName() == null || req.cardHolderName().trim().isEmpty()) {
            errors.add("Card holder name is required");
        } else if (req.cardHolderName().trim().length() < 3) {
            errors.add("Card holder name must be at least 3 characters");
        } else if (!req.cardHolderName().matches("^[a-zA-Z\\s]+$")) {
            errors.add("Card holder name can only contain letters and spaces");
        }

        if (req.cardExpiryDate() == null || req.cardExpiryDate().isBlank()) {
            errors.add("Card expiry date is required");
        } else if (!req.cardExpiryDate().matches("^(0[1-9]|1[0-2])/([0-9]{2})$")) {
            errors.add("Card expiry date must be in MM/YY format");
        } else {
            String[] parts = req.cardExpiryDate().split("/");
            int month = Integer.parseInt(parts[0]);
            int year = 2000 + Integer.parseInt(parts[1]);
            int currentYear = java.time.Year.now().getValue();
            int currentMonth = java.time.LocalDate.now().getMonthValue();

            if (year < currentYear || (year == currentYear && month < currentMonth)) {
                errors.add("Card has expired");
            }
        }

        if (req.cardCvv() == null || !req.cardCvv().matches("^[0-9]{3,4}$")) {
            errors.add("CVV must be 3 or 4 digits");
        }

        return errors;
    }

    private boolean luhnCheck(String cardNumber) {
        int sum = 0;
        boolean alternate = false;
        for (int i = cardNumber.length() - 1; i >= 0; i--) {
            int n = Integer.parseInt(cardNumber.substring(i, i + 1));
            if (alternate) {
                n *= 2;
                if (n > 9) n = (n % 10) + 1;
            }
            sum += n;
            alternate = !alternate;
        }
        return (sum % 10 == 0);
    }
}

class BankTransferValidator implements PaymentValidator {
    @Override
    public List<String> validate(UploadPaymentRequest req) {
        List<String> errors = new ArrayList<>();

        if (req.bankName() == null || req.bankName().trim().isEmpty()) {
            errors.add("Bank name is required");
        } else if (req.bankName().trim().length() < 3) {
            errors.add("Bank name must be at least 3 characters");
        }

        if (req.accountNumber() == null || req.accountNumber().trim().isEmpty()) {
            errors.add("Account number is required");
        } else if (req.accountNumber().replaceAll("\\s", "").length() < 8) {
            errors.add("Account number must be at least 8 digits");
        } else if (!req.accountNumber().replaceAll("\\s", "").matches("^[0-9]+$")) {
            errors.add("Account number must contain only digits");
        }

        if (req.accountHolderName() == null || req.accountHolderName().trim().isEmpty()) {
            errors.add("Account holder name is required");
        } else if (req.accountHolderName().trim().length() < 3) {
            errors.add("Account holder name must be at least 3 characters");
        }

        if (req.branchCode() != null && !req.branchCode().trim().isEmpty()) {
            if (!req.branchCode().matches("^[A-Z0-9]{4,10}$")) {
                errors.add("Branch code must be 4-10 alphanumeric characters");
            }
        }

        if (req.transferDate() == null || req.transferDate().isBlank()) {
            errors.add("Transfer date is required");
        } else {
            try {
                java.time.LocalDate transferDate = java.time.LocalDate.parse(req.transferDate());
                java.time.LocalDate today = java.time.LocalDate.now();
                if (transferDate.isAfter(today)) {
                    errors.add("Transfer date cannot be in the future");
                }
                if (transferDate.isBefore(today.minusDays(90))) {
                    errors.add("Transfer date cannot be older than 90 days");
                }
            } catch (Exception e) {
                errors.add("Invalid transfer date format (use YYYY-MM-DD)");
            }
        }

        return errors;
    }
}

class PayPalValidator implements PaymentValidator {
    @Override
    public List<String> validate(UploadPaymentRequest req) {
        List<String> errors = new ArrayList<>();

        if (req.paypalEmail() == null || req.paypalEmail().trim().isEmpty()) {
            errors.add("PayPal email is required");
        } else if (!req.paypalEmail().matches("^[A-Za-z0-9+_.-]+@(.+)$")) {
            errors.add("Invalid PayPal email format");
        }

        if (req.paypalTransactionId() == null || req.paypalTransactionId().trim().isEmpty()) {
            errors.add("PayPal transaction ID is required");
        } else if (req.paypalTransactionId().trim().length() < 10) {
            errors.add("PayPal transaction ID must be at least 10 characters");
        } else if (!req.paypalTransactionId().matches("^[A-Z0-9]+$")) {
            errors.add("PayPal transaction ID must be alphanumeric");
        }

        return errors;
    }
}

class CashOnDeliveryValidator implements PaymentValidator {
    @Override
    public List<String> validate(UploadPaymentRequest req) {
        return new ArrayList<>(); // No specific validation for COD
    }
}
