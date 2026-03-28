package com.lumilingua.crms.entity;

import com.lumilingua.crms.enums.StatusEnum;
import jakarta.persistence.*;
import lombok.Builder;
import lombok.Data;
import lombok.Getter;
import lombok.Setter;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.Date;
//User pick mentor
//        ↓
//User fill expected fee
//        ↓
//Mentor decision
//   ↓        ↓
//Approve    Negotiate
//   ↓          ↓
//User approve  User approve / reject
//   ↓
//User pay
//   ↓
//System calculate fee


//Flow 1 — Mentor đồng ý luôn
//Step 1
//
//User chọn mentor
//
//        expectedFeeUser = 100$
//        statusUser = PENDING
//statusStaff = PENDING
//Step 2
//
//Mentor approve
//
//statusStaff = APPROVED
//Step 3
//
//User approve
//
//statusUser = APPROVED
//        agreeFee = expectedFeeUser
//Step 4
//
//User thanh toán
//
//App tính phí:
//
//summaryFeePlatform = agreeFee * percentFeePlatform / 100
//
//salaryStaff = agreeFee - summaryFeePlatform
//
//Ví dụ
//
//agreeFee = 100
//percent = 20
//
//summaryFeePlatform = 20
//salaryStaff = 80
//Flow 2 — Mentor muốn negotiate
//Step 1
//
//User
//
//        expectedFeeUser = 100
//statusUser = PENDING
//        statusStaff = PENDING
//Step 2
//
//Mentor negotiate
//
//statusStaff = HOLD
//        agreeFee = 120
//Step 3
//
//User nhận offer
//
//Case 1: User đồng ý
//        statusUser = APPROVED
//statusStaff = APPROVED
//Case 2: User từ chối
//        statusUser = REJECTED
//contract cancel
//Step 4
//
//User thanh toán
//
//Tính giống Flow 1
//
//Flow 3 — Mentor từ chối
//
//Mentor reject
//
//statusStaff = REJECTED
//contract cancel
@Entity
@Table(
        name = "tbl_mentor_subscription",
        uniqueConstraints = {
                @UniqueConstraint(columnNames = {"id_information_staff", "id_user"})
        }
)
@Data
public class MentorSubscription {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_mentor_subscription")
    private long idMentorSubscription;

    @Column(name = "id_information_staff")
    private long idInformationStaff;

    @Column(name = "id_user")
    private long idUser;

    // user đề xuất ban đầu
    @Column(name = "expected_fee_user")
    private BigDecimal expectedFeeUser;

    // mentor đề xuất
    @Column(name = "expected_fee_mentor")
    private BigDecimal expectedFeeMentor;

    // phí cuối cùng 2 bên đồng ý
    @Column(name = "agree_fee")
    private BigDecimal agreeFee;

    // % platform lấy
    @Column(name = "percent_fee_platform")
    private Integer percentFeePlatform;

    // tiền platform nhận
    @Column(name = "summary_fee_platform")
    private BigDecimal summaryFeePlatform;

    // tiền mentor nhận
    @Column(name = "salary_staff")
    private BigDecimal salaryStaff;

    // trạng thái mentor
    @Enumerated(EnumType.STRING)
    @Column(name = "status_staff", nullable = false)
    private StatusEnum statusStaff = StatusEnum.PENDING;

    // trạng thái user
    @Enumerated(EnumType.STRING)
    @Column(name = "status_user", nullable = false)
    private StatusEnum statusUser = StatusEnum.PENDING;

    // thời gian user thanh toán
    @Column(name = "user_paid_at")
    private LocalDateTime userPaidAt;

    // thời gian platform trả mentor
    @Column(name = "platform_paid_at")
    private LocalDateTime platformPaidAt;

    @CreationTimestamp
    private Date createdAt;

    @UpdateTimestamp
    private Date updatedAt;
}
