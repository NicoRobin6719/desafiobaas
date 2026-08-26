# RELATÓRIO DE CORREÇÃO DE BUGS

Este relatório documenta as correções aplicadas aos 8 bugs plantados no repositório.
Para cada bug há: descrição, como era antes (trecho), e como ficou depois (trecho), e uma breve explicação técnica.

---

## Bug 01 — Login silencia erros
Arquivo: src/app/(auth)/login/page.tsx

Antes:
```ts
} catch {
  // catch vazio — erro engolido
}
```
Depois:
```ts
} catch (err) {
  const msg = err instanceof Error ? err.message : String(err);
  if (msg.includes("invalid-credential") || msg.includes("wrong-password")) {
    setErro("E-mail ou senha incorretos.");
  } else if (msg.includes("user-not-found")) {
    setErro("Nenhuma conta encontrada com este e-mail.");
  } else {
    setErro("Erro ao entrar. Tente novamente.");
  }
}
```

![bug01-before](session-files/screenshots/bug01-before.png)

![bug01-after](session-files/screenshots/bug01-after.png)

Explicação: o catch vazio escondia falhas do processo de login. Agora a mensagem de erro é exibida ao usuário com mensagens mais específicas quando possível.

---

## Bug 02 — Middleware com condição invertida
Arquivo: middleware.ts

Antes:
```ts
if (token) {
  return NextResponse.redirect(new URL("/login", request.url));
}
```
Depois:
```ts
if (!token) {
  return NextResponse.redirect(new URL("/login", request.url));
}
```

![bug02-before](session-files/screenshots/bug02-before.png)

![bug02-after](session-files/screenshots/bug02-after.png)

Explicação: a negação foi aplicada para garantir que somente usuários não autenticados sejam redirecionados para a tela de login.

---

## Bug 03 — Confirmação de senha compara com nome
Arquivo: src/app/(auth)/cadastro/page.tsx

Antes:
```ts
if (senha !== nome) {
  setErro("As senhas não coincidem.");
}
```
Depois:
```ts
if (senha !== confirmarSenha) {
  setErro("As senhas não coincidem.");
}
```

![bug03-before](session-files/screenshots/bug03-before.png)

![bug03-after](session-files/screenshots/bug03-after.png)

Explicação: validação de formulário corrigida para comparar senha com confirmarSenha, evitando aceitações indevidas.

---

## Bug 04 — Query sem filtro de userId
Arquivo: src/services/personagens.ts

Antes:
```ts
const q = query(collection(db, "personagens"));
```
Depois:
```ts
const q = query(
  collection(db, "personagens"),
  where("userId", "==", _uid)
);
```

![bug04-before](session-files/screenshots/bug04-before.png)

![bug04-after](session-files/screenshots/bug04-after.png)

Explicação: adiciona-se filtro por userId para evitar exposição de dados de outros usuários.

---

## Bug 05 — Nome de coleção errado no create
Arquivo: src/services/personagens.ts

Antes:
```ts
const ref = await addDoc(collection(db, "personagem"), { ... });
```
Depois:
```ts
const ref = await addDoc(collection(db, "personagens"), { ... });
```

![bug05-before](session-files/screenshots/bug05-before.png)

![bug05-after](session-files/screenshots/bug05-after.png)

Explicação: padroniza nome da coleção para 'personagens' (plural) garantindo consistência entre leitura e escrita.

---

## Bug 06 — setDoc apaga o documento inteiro
Arquivo: src/services/personagens.ts

Antes:
```ts
await setDoc(doc(db, "personagens", personagemId), { [slot]: itemId });
```
Depois:
```ts
await updateDoc(doc(db, "personagens", personagemId), { [slot]: itemId });
```

![bug06-before](session-files/screenshots/bug06-before.png)

![bug06-after](session-files/screenshots/bug06-after.png)

Explicação: setDoc substitui todo o documento; updateDoc atualiza apenas o(s) campo(s) informados.

---

## Bug 07 — Deletar usa índice como ID
Arquivo: src/services/personagens.ts

Antes:
```ts
await deleteDoc(doc(db, "personagens", String(indice)));
```
Depois:
```ts
await deleteDoc(doc(db, "personagens", personagem.id));
```

![bug07-before](session-files/screenshots/bug07-before.png)

![bug07-after](session-files/screenshots/bug07-after.png)

Explicação: usa-se o id real do documento em vez do índice da lista para garantir que o documento correto seja removido.

---

## Bug 08 — Security Rules abertas
Arquivo: firestore.rules

Antes:
```rules
match /{document=**} {
  allow read, write: if true;
}
```
Depois:
```rules
match /personagens/{personagemId} {
  allow read: if request.auth != null &&
              request.auth.uid == resource.data.userId;
  allow create: if request.auth != null &&
                request.auth.uid == request.resource.data.userId;
  allow update, delete: if request.auth != null &&
                        request.auth.uid == resource.data.userId;
}
```

![bug08-before](session-files/screenshots/bug08-before.png)

![bug08-after](session-files/screenshots/bug08-after.png)

Explicação: regras agora exigem autenticação e correspondência do userId para leituras e escritas, protegendo os dados dos usuários.

---

Observações finais
- Cada correção foi committada separadamente (8 commits: fix(bug01) … fix(bug08)).
- O deploy e testes adicionais (build) não foram executados automaticamente aqui — recomenda-se rodar `npm run build` e verificar deployment na Vercel.

