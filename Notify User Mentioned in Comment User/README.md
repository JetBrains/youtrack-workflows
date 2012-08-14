Notify User Mentioned in Comment
====================
Send notification to a user mentioned in a comment.
```java
schedule rule send notification to a user mentioned in comment

daily at 12 : 00 : 00 [<expression>] {
  var mentionedUser;
  for each comment in comments {
    if (comment.text.contains("remind", opts) && comment.created + 1 day > now) {
      mentionedUser = comment.text.substringBetween("remind @", " ");
    }
  }

  for each user in {group: New Users}.getUsers() {
    if (user.login.eq(mentionedUser, opts)) {
      user.notify("You were mentioned", "Your name was mentioned in a comment in " + getId());
    }
  }
}
```
