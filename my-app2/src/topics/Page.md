# Chinese Remainder Theorem

:::question:

Solve the following system by the Chinese Remainder theorem:

$$
\begin{cases}
x \equiv 2 \pmod{3} \\
x \equiv 3 \pmod{5} \\
x \equiv 2 \pmod{7}
\end{cases}
$$
:::

:::ok_hand:

## Solution using the Chinese Remainder Theorem:

### Step 1: Identify the coefficients and moduli

$$
\begin{aligned}
a_1 &= 2, & m_1 &= 3 \\
a_2 &= 3, & m_2 &= 5 \\
a_3 &= 2, & m_3 &= 7
\end{aligned}
$$

### Step 2: Calculate the product of all moduli

$$
\begin{aligned}
M &= m_1 \times m_2 \times m_3 \\
&= 3 \times 5 \times 7 \\
&= 105
\end{aligned}
$$

### Step 3: Calculate $M_i = \frac{M}{m_i}$ for each modulus

$$
\begin{aligned}
M_1 &= \frac{M}{m_1} = \frac{105}{3} = 35 \\
M_2 &= \frac{M}{m_2} = \frac{105}{5} = 21 \\
M_3 &= \frac{M}{m_3} = \frac{105}{7} = 15
\end{aligned}
$$

### Step 4: Find the multiplicative inverses

We need to find $y_i$ such that $M_i \cdot y_i \equiv 1 \pmod{m_i}$ for each $i$.

For $y_1$: Solving $35y_1 \equiv 1 \pmod{3}$

$$
\begin{aligned}
35 &\equiv 2 \pmod{3} \\
\text{So } 2y_1 &\equiv 1 \pmod{3}
\end{aligned}
$$

Testing values:
- $y_1 = 2$ works because $2 \cdot 2 = 4 \equiv 1 \pmod{3}$ ✓

For $y_2$: Solving $21y_2 \equiv 1 \pmod{5}$

$$
\begin{aligned}
21 &\equiv 1 \pmod{5} \\
\text{So } y_2 &= 1 \text{ works} ✓
\end{aligned}
$$

For $y_3$: Solving $15y_3 \equiv 1 \pmod{7}$

$$
\begin{aligned}
15 &\equiv 1 \pmod{7} \\
\text{So } y_3 &= 1 \text{ works} ✓
\end{aligned}
$$

### Step 5: Calculate the solution

$$
\begin{aligned}
x &\equiv a_1M_1y_1 + a_2M_2y_2 + a_3M_3y_3 \pmod{M} \\
&\equiv 2 \cdot 35 \cdot 2 + 3 \cdot 21 \cdot 1 + 2 \cdot 15 \cdot 1 \pmod{105} \\
&\equiv 140 + 63 + 30 \pmod{105} \\
&\equiv 233 \pmod{105}
\end{aligned}
$$

Since $233 = 2 \cdot 105 + 23$:

$$x \equiv 23 \pmod{105}$$

Therefore, the solution to the system of congruences is $x \equiv 23 \pmod{105}$.

:::

