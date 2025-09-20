## Current Business Flow

- Stage 1 diagram

  ![](./assets/images/current-flow-diagram-stage-1.png)

- Stage 2 diagram

  ![](./assets/images/current-flow-diagram-stage-2.png)

## The Problems

- Sometimes, the laundry left behind some clothes that want to the next process, so it not proper the sequence and the priority
- Sometimes, the laundry forgot the finished clothes location when the customer want to picking-up

## The Solutions

- Need a system to remaind the estimation of clothes process based on the duration that choosen by the customer, so the laundry can order the priority to be finished
- Need a system to update the status of the clothes, so the customer will get the notification regarding the status. The customer also can track the status using provided public webpage (seems like logistic tracking)
- Need a system for the laundry to set the location for the finished the clothes process, so the laundry can be find easily where the finished clothes they area putted in when the customer want to picking-up

## Software Requirement Specification (SRS)

### Functional Requirements

- System able to create new transaction
- System able to search the transaction
- System able to create payment in transaction
- System able to print the receipt in transaction
- System able to update the clothes status in transaction
- System able to set the finished clothe location once the process in completed
- System able to conclude the transaction by set the pick-up date

![System Flow Diagram Stage 1](./assets/images/system-flow-diagram-stage-1.jpg)

![System Flow Diagram Stage 2](./assets/images/system-flow-diagram-stage-2.jpg)

### Non-functional Requirements

- System able to support another language:
  - English (default)
  - Indonesia
- System compatible for responsiveness in any screen sizes

### Database Diagram

![Database Diagram](./assets/images/database-diagram.png)
