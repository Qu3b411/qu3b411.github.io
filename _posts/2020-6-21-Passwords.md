---
title: Passwords How big companies are doing it wrong
published: false
---

I'm going to make a bold claim, **Few companies, get their passwords right**. Often time's the institutions that are creating the lowest security barriors are the ones that should be getting it right.  Any institution that deals with personal or sensitive information have no business getting authentication mechanisms wrong. Yet time and time again the institutions dealing with the most sensitive data are the ones making the most glaring mistakes. 

# Max Password Lengths

Consider the last time you saw this line
```
Passwords must be between 8 and 16 characters long
```
Any one who is aware of security should automatically associate this with
```
We dont care about security best practice, we store your password in plaintext
```

Their are reasonable limits that can be set on the length of a password, but 16 characters is not a reasonable limit. lets address this mathamaticaly

**For the remainder of this post** we will measure the strength of a password by its entropy _e_ state, log<sub>2</sub>(|Γ|), where Γ is the set of characters in a given alphabet (an alphabet in this case being a finite set of characters). 


| Γ | \|Γ\| | log<sub>2</sub>(\|Γ\|) | _e_ |
|---|---|---|---|
| 0-1 | 2 | log<sub>2</sub>(\|2\|) | 1 |
| 0-9 | 10 | log<sub>2</sub>(\|10\|) | 3.321928 |
| a-z | 26 | log<sub>2</sub>(\|26\|) | 4.70044 |
| a-zA-Z | 52 | log<sub>2</sub>(\|52\|) | 5.70044 |
| a-zA-Z0-9 | 62 | log<sub>2</sub>(\|62\|) | 5.954196 |
| All ASCII printable characters | 95 | log<sub>2</sub>(\|62\|) | 6.569856 |
| \x00-\xff | 256 | log<sub>2</sub>(\|256\|) | 8 |

**Remember** passwords should never be stored in plaintext, they should allways be hashed into a constatnt length string of characters. 

| Γ         |length : _e_ | length : _e_ | length :  _e_ | length :  _e_ |
| ---       | ---           | ---             |   ---            | ---             |
| \x00-\xFF | 16 : 128 bits | 32 : 256 bits |  48 : 384 bits | 64 : 512 bits |
| 0,1 | 128 : 128 bits | 256 : 256 bits | 384 : 384 bits | 512 : 512 bits |
| 0-9 | 39 : ~130 bits | 78 : ~259 bits | 116 : ~386 bits |  155 : ~514 bits |
| a-z | 28 : ~132 bits | 55 : ~258 bits | 82 : ~385 bits | 109 : ~512 bits |
| a-zA-Z | 23 : ~131 bits | 45 : ~ 256 bits | 68 : ~388 bits | 90 : ~513 bits |
| a-zA-Z0-9 | 22 : ~130 bits | 43 : ~256 bits | 65 : ~387 bits | 86 : ~512 bits |
|  All ASCII printable characters | 20 : ~131 bits | 39 : 256 bits | 59 : ~387 bits | 78 : ~512 bits| 

If a password based key derivation function produces a 256 bit key then setting a maximum of 43 alphanumeric characters makes perfect sense. less then 65 ensures the password is the weekest length, greater then 43 characters would produce overhead in computational resources, this decision can be mathamatically justified. 

people are using password managers we can generate passwords to any length and any complexity. 
