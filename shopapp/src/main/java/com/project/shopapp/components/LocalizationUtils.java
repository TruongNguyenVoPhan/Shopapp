package com.project.shopapp.components;

import com.project.shopapp.ultils.WebUtils;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.context.MessageSource;
import org.springframework.stereotype.Component;
import org.springframework.web.servlet.LocaleResolver;

import java.util.Locale;

@Component
@RequiredArgsConstructor
public class LocalizationUtils {
    private final MessageSource messageSource;
    private final LocaleResolver localeResolver;

    public String getLocalizedMessage(String messageKey, Object ... params){ //spread operator
        HttpServletRequest request = WebUtils.getCurrentHttp();
        Locale locale = localeResolver.resolveLocale(request);
        return messageSource.getMessage(messageKey,params, locale);
    }
}
