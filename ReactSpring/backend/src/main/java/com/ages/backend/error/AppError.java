package com.ages.backend.error;

import lombok.Getter;
import lombok.Setter;
import org.springframework.http.HttpStatus;

@Getter
@Setter
public class AppError extends RuntimeException {

    private HttpStatus status;
    public AppError(String message, HttpStatus status) {
        super(message);
        this.status = status;
    }
}
