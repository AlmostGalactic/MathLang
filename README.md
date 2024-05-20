# MathLang
A Simple language for math!

In order to use this language your gonna need Deno.
You can get it from [Here](https://deno.com/)
to start this language you need to go to the folder you downloaded it in via cd command
```bash
cd "folder here"
```
then run the command
```bash
deno run -A main.ts
```
to startup the language!
PS: If you want to stop running the language, just enter "exit"

# Simple Math
MathLang can do math! (Of course)
```
10*2/(10*0.5)
```
```
4
```
If you want a negative number, use the flip keyword (or just to flip a numbers value ex: -1 to 1 and 1 to -1)
```
5*flip 1 (or any number here)
```
```
-5
```
Or just do
```
flip 5 (or any number here)
```
```
-5
```

# More Advanced Math
There are more features too!

If you want to get the absolute value of a number, use the abs keyword!
```
abs flip 5 * 2
```
```
10
```

You can get the sin and cosine values of numbers too.
Just use the sin and cos keywords
```
cos abs flip 10 * 2 / 5
sin abs flip 10 * 2 / 5
```
```
-0.6536436208636119
-0.7568024953079282
```

same with floor and ceil
```
floor 5.2
ceil 5.2
```
```
5
6
```
