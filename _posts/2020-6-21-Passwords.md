---
title: Passwords How big companies are doing it wrong
published: false
---

I'm going to make a bold claim, **Few companies, get their passwords right**. Often time's I observe the companies doing it wrong are the ones that should get it right. Financial, Creditors, Lenders, Any institution that deals with personal or sensitive information. These are all institutions that have no business getting authentication mechanisms wrong. Yet time and time again the institutions dealing with the most sensitive data are the ones making the most glaring mistakes. 

# Max Password Lengths

One of my biggest gripe with any system. Consider the last time you saw this line
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

**Remember** passwords are never stored in plain text, they are allways hashed into a constatnt length string of characters. 

| Key Lengths | 128 | | 256 | 384 | 512 |

passwords should be hashed by a reasonable PBKDF (**P**assword **B**assed **K**ey **D**erivation  **F**unction) generating keys of either 128 bits (16 bytes), or 256 bits(32 bytes). 
