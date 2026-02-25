# Page snapshot

```yaml
- generic [ref=e2]:
  - region "Notifications (F8)":
    - list
  - region "Notifications alt+T"
  - generic [ref=e3]:
    - generic [ref=e4]:
      - generic [ref=e10]:
        - img [ref=e11]
        - heading "คลินิกแพทย์แผนไทย" [level=1] [ref=e13]
      - generic [ref=e14]:
        - blockquote [ref=e15]: "\"ดูแลสุขภาพของคุณได้ทุกที่ ทุกเวลา\""
        - paragraph [ref=e16]: — ระบบผู้ป่วยออนไลน์
    - generic [ref=e18]:
      - button "← กลับ" [ref=e19] [cursor=pointer]
      - generic [ref=e20]:
        - tablist [ref=e21]:
          - tab "เข้าสู่ระบบ" [selected] [ref=e22] [cursor=pointer]
          - tab "ลงทะเบียน" [ref=e23] [cursor=pointer]
        - tabpanel "เข้าสู่ระบบ" [ref=e24]:
          - generic [ref=e25]:
            - generic [ref=e26]:
              - heading "เข้าสู่ระบบผู้ป่วย" [level=3] [ref=e27]
              - paragraph [ref=e28]: เข้าสู่ระบบเพื่อดูประวัติการรักษาของคุณ
            - generic [ref=e30]:
              - generic [ref=e31]:
                - text: อีเมล
                - textbox "อีเมล" [ref=e32]:
                  - /placeholder: your@email.com
                  - text: patient.test@example.com
              - generic [ref=e33]:
                - text: รหัสผ่าน
                - textbox "รหัสผ่าน" [ref=e34]:
                  - /placeholder: ••••••••
                  - text: TestPatient123!
              - button "เข้าสู่ระบบ" [ref=e35] [cursor=pointer]
```