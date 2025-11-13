package com.lumilingua.crms.common;


import java.time.LocalDateTime;
import java.time.ZoneId;
import java.time.temporal.ChronoUnit;
import java.util.Date;
import java.util.Map;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

public class DateTimeUtils {
    private static final Pattern PATTERN = Pattern.compile("(\\d+)\\s*(day|days|month|months|year|years)", Pattern.CASE_INSENSITIVE);
    private static final Map<String, ChronoUnit> UNIT_MAP = Map.of(
            "day", ChronoUnit.DAYS,
            "days", ChronoUnit.DAYS,
            "month", ChronoUnit.MONTHS,
            "months", ChronoUnit.MONTHS,
            "year", ChronoUnit.YEARS,
            "years", ChronoUnit.YEARS
    );

    public static Date parseAlphabetToDate(String input) {
        if (input == null || input.isBlank()) {
            throw new IllegalArgumentException("The input is null or blank!");
        }

        Matcher matcher = PATTERN.matcher(input.trim());
        if (!matcher.matches()) {
            throw new IllegalArgumentException("The input is invalid format!");
        }

        int amount = Integer.parseInt(matcher.group(1));
        String unitStr = matcher.group(2).toLowerCase();
        ChronoUnit unit = UNIT_MAP.get(unitStr);

        if (unit == null) {
            throw new IllegalArgumentException("The feature is not support : " + unitStr);
        }

        LocalDateTime future = LocalDateTime.now().plus(amount, unit);

        return Date.from(future.atZone(ZoneId.systemDefault()).toInstant());
    }
}
