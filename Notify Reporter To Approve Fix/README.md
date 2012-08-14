Notify Reporter To Approve Fix 
====================

Send a specific notification to the reporter to approve the fix.
Introduce State life-cycle including reporter verification.

Send a notification to the reporter to approve fix
```java
rule Send specific notification to reporter to approve fix

when State.becomes({Pending verification}) {
  reporter.notify("Please approve fix for the issue" + getId(), "You have reported issue"
 + getId() + "Please review the applied fix for your issue and set the appropriate state.");
  Assignee = reporter;
}
State life-cycle with verified by reporter value
```java
statemachine State lifecycle with verification by reporter for field State {

  initial state Submitted {
    on Open[always] do {<define statements>} transit to Open
  }

  state Open {
    on Fix[always] do {<define statements>} transit to Fixed
  }

  state Fixed {
    enter {
      Fixed in build.required("Please set the 'Fixed in build' value.");
    }

    on Send for verification[always] do {<define statements>} transit to Pending verification
  }

  state Pending verification {
    enter {
      Assignee = reporter;
      reporter.notify("Please approve fix for the issue" + getId(), "You have reported issue"
 + getId() + "Please review the applied fix for the issue and set the appropriate state.");
    }

    on Approve[always] do {<define statements>} transit to Verified

    on Reopen[always] do {<define statements>} transit to Open
  }

  state Verified {
    on Reopen[always] do {<define statements>} transit to Open
  }

}
```
