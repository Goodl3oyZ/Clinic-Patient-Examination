# Page snapshot

```yaml
- generic [ref=e2]:
  - region "Notifications (F8)":
    - list
  - region "Notifications alt+T"
  - generic [ref=e4]:
    - button "กลับ" [ref=e5] [cursor=pointer]:
      - img
      - text: กลับ
    - generic [ref=e6]:
      - img [ref=e8]
      - heading "ลงทะเบียนบัญชีผู้ป่วย" [level=1] [ref=e10]
      - paragraph [ref=e11]: ขั้นตอนที่ 1 จาก 2
    - generic [ref=e15]:
      - generic [ref=e16]:
        - heading "ยืนยันตัวตน" [level=3] [ref=e17]
        - paragraph [ref=e18]: กรอกข้อมูลเพื่อตรวจสอบในระบบ (ต้องลงทะเบียนที่คลินิกก่อน)
      - generic [ref=e20]:
        - generic [ref=e21]:
          - text: เลขบัตรประชาชน 13 หลัก *
          - textbox "เลขบัตรประชาชน 13 หลัก *" [ref=e22]:
            - /placeholder: X-XXXX-XXXXX-XX-X
        - generic [ref=e23]:
          - text: วันเกิด *
          - textbox "วันเกิด *" [active] [ref=e24]
        - generic [ref=e25]:
          - text: เบอร์โทรศัพท์ *
          - textbox "เบอร์โทรศัพท์ *" [ref=e26]:
            - /placeholder: 08X-XXX-XXXX
        - paragraph [ref=e28]: หากยังไม่เคยลงทะเบียนที่คลินิก กรุณาติดต่อเจ้าหน้าที่เพื่อลงทะเบียนก่อน
        - button "ตรวจสอบข้อมูล" [ref=e29] [cursor=pointer]:
          - text: ตรวจสอบข้อมูล
          - img
    - paragraph [ref=e30]:
      - text: มีบัญชีอยู่แล้ว?
      - button "เข้าสู่ระบบ" [ref=e31] [cursor=pointer]
```