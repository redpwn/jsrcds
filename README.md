challenge configs define infrastructure, so we should use infrastructure-as-code to manage them i think

problem:

- ctf runners shouldnt have to know how to use terraform
- challenge authors shouldnt have to know how to use terraform
- challenge config extenders shouldnt have to know how to use terraform

rcds automatically manages challenge infra for you (yippie)

solution:

- ctf runners can just run `rcds deploy`
- challenge authors can write in a simple challenge format (which will synthesize terraform)
- challenge config extenders can write typescript (and rcds will hook that up to terraform)
