Voting App
=========
This repository contain the RESULT part of the complete voting application
* Result part: [https://github.com/CYYG/catvsdog-worker](https://github.com/CYYG/catvsdog-worker)
* Vote part: [https://github.com/CYYG/catvsdog-vote](https://github.com/CYYG/catvsdog-vote)
* Lambda Worker: [https://github.com/CYYG/catvsdog-result](https://github.com/CYYG/catvsdog-result)
* Terraform: [https://github.com/ralbon/AWS-BBL-Infra](https://github.com/ralbon/AWS-BBL-Infra)

Getting started
---------------

Run in this directory:
```
docker-compose up
```
The app will display the result interface at [http://localhost:5001](http://localhost:5000)

Architecture
-----

![Architecture diagram](architecture.png)

* A Python webapp which lets you vote between two options
* A Redis queue which collects new votes
* A Python worker (designed for lambda) which consumes votes and stores them in…
* A Postgres database backed by a Docker volume
* **A Node.js webapp which shows the results of the voting in real time (THIS REPO)**


Note
----

The voting application only accepts one vote per client. It does not register votes if a vote has already been submitted from a client.
