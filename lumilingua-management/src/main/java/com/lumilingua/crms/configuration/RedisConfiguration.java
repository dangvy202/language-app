//package com.lumilingua.crms.configuration;
//
//import org.springframework.context.annotation.Bean;
//import org.springframework.context.annotation.Configuration;
//import org.springframework.data.redis.connection.RedisStandaloneConfiguration;
//import org.springframework.data.redis.connection.jedis.JedisConnectionFactory;
//
//@Configuration
//public class RedisConfiguration {
//    @Bean
//    public JedisConnectionFactory jedisConnectionFactory() {
//        RedisStandaloneConfiguration redisStandaloneConfiguration =
//                new RedisStandaloneConfiguration("localhost",6379);
//        return new JedisConnectionFactory(redisStandaloneConfiguration);
//    }
//
//    //    @Bean
//    //    public RedisTemplate<String, byte[]> redisTemplate() {
//    //        RedisTemplate<String,byte[]> redisTemplate = new RedisTemplate<>();
//    //        redisTemplate.setConnectionFactory(jedisConnectionFactory());
//    //        redisTemplate.setKeySerializer(new StringRedisSerializer());
//    //        redisTemplate.setValueSerializer(new StringRedisSerializer());
//    //        redisTemplate.setHashKeySerializer(new StringRedisSerializer());
//    //        redisTemplate.afterPropertiesSet();
//    //        return redisTemplate;
//    //    }
//}