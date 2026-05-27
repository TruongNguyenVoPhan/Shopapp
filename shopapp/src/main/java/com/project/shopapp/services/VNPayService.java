package com.project.shopapp.services;

import com.project.shopapp.configurations.VNPayConfig;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import javax.crypto.Mac;
import javax.crypto.spec.SecretKeySpec;
import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.text.SimpleDateFormat;
import java.util.*;

@Service
@RequiredArgsConstructor
public class VNPayService {

    private final VNPayConfig vnPayConfig;

    public String createPaymentUrl(Long orderId, long amount, String orderInfo, String ipAddr) throws Exception {
        String vnp_Version = "2.1.0";
        String vnp_Command = "pay";
        String vnp_CurrCode = "VND";
        String vnp_Locale = "vn";
        String vnp_OrderType = "other";

        String vnp_TxnRef = orderId + "_" + System.currentTimeMillis();

        Map<String, String> vnp_Params = new TreeMap<>();
        vnp_Params.put("vnp_Version", vnp_Version);
        vnp_Params.put("vnp_Command", vnp_Command);
        vnp_Params.put("vnp_TmnCode", vnPayConfig.getTmnCode());
        vnp_Params.put("vnp_Amount", String.valueOf(amount * 100)); 
        vnp_Params.put("vnp_CurrCode", vnp_CurrCode);
        vnp_Params.put("vnp_TxnRef", vnp_TxnRef);
        vnp_Params.put("vnp_OrderInfo", orderInfo);
        vnp_Params.put("vnp_OrderType", vnp_OrderType);
        vnp_Params.put("vnp_Locale", vnp_Locale);
        vnp_Params.put("vnp_ReturnUrl", vnPayConfig.getReturnUrl());
        vnp_Params.put("vnp_IpAddr", ipAddr);

        SimpleDateFormat formatter = new SimpleDateFormat("yyyyMMddHHmmss");
        formatter.setTimeZone(TimeZone.getTimeZone("Asia/Ho_Chi_Minh"));
        String vnp_CreateDate = formatter.format(new Date());
        Calendar cal = Calendar.getInstance(TimeZone.getTimeZone("Asia/Ho_Chi_Minh"));
        cal.add(Calendar.MINUTE, 15);
        String vnp_ExpireDate = formatter.format(cal.getTime());

        vnp_Params.put("vnp_CreateDate", vnp_CreateDate);
        vnp_Params.put("vnp_ExpireDate", vnp_ExpireDate);

        StringBuilder hashData = new StringBuilder();
        StringBuilder query = new StringBuilder();

        Iterator<Map.Entry<String, String>> itr = vnp_Params.entrySet().iterator();

        while (itr.hasNext()) {
            Map.Entry<String, String> entry = itr.next();

            String fieldName = entry.getKey();
            String fieldValue = entry.getValue();

            hashData.append(URLEncoder.encode(fieldName, StandardCharsets.US_ASCII.toString()))
                    .append('=')
                    .append(URLEncoder.encode(fieldValue, StandardCharsets.US_ASCII.toString()));

            query.append(URLEncoder.encode(fieldName, StandardCharsets.US_ASCII.toString()))
                .append('=')
                .append(URLEncoder.encode(fieldValue, StandardCharsets.US_ASCII.toString()));

            if (itr.hasNext()) {
                hashData.append('&');
                query.append('&');
            }
        }

        String queryUrl = query.toString();
        String hashDataStr = hashData.toString();

        String vnp_SecureHash = hmacSHA512(vnPayConfig.getHashSecret(), hashDataStr);

        queryUrl += "&vnp_SecureHashType=HmacSHA512";
        queryUrl += "&vnp_SecureHash=" + vnp_SecureHash;

        System.out.println("HASH DATA: " + hashDataStr);
        System.out.println("PAYMENT URL: " + vnPayConfig.getUrl() + "?" + queryUrl);

        return vnPayConfig.getUrl() + "?" + queryUrl;
    }

    public boolean verifyPayment(Map<String, String> params) throws Exception {
        String vnp_SecureHash = params.get("vnp_SecureHash");

        Map<String, String> verifyParams = new TreeMap<>(params);
        verifyParams.remove("vnp_SecureHash");
        verifyParams.remove("vnp_SecureHashType");

        StringBuilder hashData = new StringBuilder();
        for (Map.Entry<String, String> entry : verifyParams.entrySet()) {

            hashData.append(URLEncoder.encode(entry.getKey(), StandardCharsets.US_ASCII.toString()))
                    .append('=')
                    .append(URLEncoder.encode(entry.getValue(), StandardCharsets.US_ASCII.toString()));

            hashData.append('&');
        }
        String hashDataStr = hashData.substring(0, hashData.length() - 1);
        String calculatedHash = hmacSHA512(vnPayConfig.getHashSecret(), hashDataStr);

        return calculatedHash.equals(vnp_SecureHash);
    }

    private String hmacSHA512(String key, String data) throws Exception {
        Mac hmac = Mac.getInstance("HmacSHA512");
        SecretKeySpec secretKey = new SecretKeySpec(key.getBytes(StandardCharsets.UTF_8), "HmacSHA512");
        hmac.init(secretKey);
        byte[] hash = hmac.doFinal(data.getBytes(StandardCharsets.UTF_8));
        StringBuilder sb = new StringBuilder();
        for (byte b : hash) {
            sb.append(String.format("%02x", b));
        }
        return sb.toString();
    }
}