# @visual-analytics-components/manager

The Manager serves as a centralized entry-point to the Disaggregated Visuals framework. It provides:

- a Common Messaging Hub with an audit trail
- an API for State Persistence

The Manager object is a singleton that may be acquired using `Manager.getInstance()` in your visual.
